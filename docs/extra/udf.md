---
sidebar_position: 1
---


# User-Defined Functions

In modern data processing and analysis, SQL language is a powerful tool for handling structured data. However, as the complexity of data analysis increases, standard SQL statements and built-in functions may not be sufficient to meet all data processing needs. This is where User Defined Functions (UDFs) come into play, allowing users to define custom functions using languages like Python and embed them into SQL language to achieve more complex calculations and operations.

## When Do You Need UDFs

UDFs are crucial when there is a need to perform calculations that cannot be supported by standard SQL functions. Here are some typical scenarios and examples:

- Complex mathematical or statistical calculations, such as calculating the greatest common divisor of two numbers.
- Custom data transformations or validations, such as extracting information from network packets.
- Need to use external services or resources, such as accessing OpenAI API to generate text.
- Migration from existing systems, such as migrating Flink UDFs and implementing functions not currently supported by RisingWave.

It is important to note that UDFs have lower execution efficiency compared to built-in functions due to cross-language communication and data conversion. Therefore, users should always prioritize the use of built-in functions.

## Types of UDFs

In RisingWave, functions can be mainly divided into three types:

1. **Scalar Functions**: These functions take a single row of input and return a single value. They are similar to traditional functions in SQL, operating on a row-by-row basis.
2. **Table Functions**: These functions take a single row of input and can return multiple rows. They can be used as tables in queries, suitable for splitting, merging, or generating data.
3. **Aggregate Functions**: These functions take a series of rows as input and return a single value. For example, `sum` or `avg`, used for data summarization.

Currently, RisingWave supports user-defined scalar functions (UDFs) and table functions (UDTFs), but does not support user-defined aggregate functions (UDAFs). Based on our experience, most requirements can be implemented using UDFs or UDTFs. If custom aggregation logic is needed, consider using the built-in `array_agg` function to aggregate the data into an array first, and then pass it to the UDF for processing.

## Use UDFs in RisingWave

Currently, RisingWave supports creating UDFs with Python and Java. Each language has its own advantages, and you can choose based on your specific needs:

- Python: It is easy to develop and deploy, making it suitable for quickly implementing functionality. However, its performance may be lower compared to Java.
- Java: It requires relatively more effort for development and deployment, but it offers better performance. It is suitable for computationally intensive functions or migrating from Flink.

Overall, we recommend developers to use Python for implementing UDFs.

### Python  UDFs

To use Python UDFs, please make sure you have [Python](https://www.python.org/downloads/) (3.8 or later) installed on your computer.

Run the following command to install the RisingWave UDF API package.

```bash
pip install risingwave
```

Create a file and implement your functions:

```python
# Import necessary APIs
from risingwave.udf import udf, udtf, UdfServer

# Define a scalar function named gcd to calculate the greatest common divisor of two integers
@udf(input_types=['INT', 'INT'], result_type='INT')
def gcd(x, y):
    while y != 0:
        (x, y) = (y, x % y)
    return x

# Define a table function named series to generate a sequence of integers
@udtf(input_types='INT', result_types='INT')
def series(n):
    for i in range(n):
        yield i

# Register functions and start the UDF server
if __name__ == '__main__':
    server = UdfServer(location="0.0.0.0:8815") # Adjust the listening address of the server
    server.add_function(gcd)
    server.add_function(series)
    server.serve()
```

Run this UDF service:

```bash
python3 udf.py
```

Next, we need to declare the functions in RisingWave:

```sql
CREATE FUNCTION gcd(int, int) RETURNS int
AS gcd USING LINK '<http://localhost:8815>';

CREATE FUNCTION series(int) RETURNS TABLE (x int)
AS series USING LINK '<http://localhost:8815>';
```

Once created successfully, we can use the UDFs just like any built-in functions:

```sql
SELECT gcd(25, 15);
----
5

SELECT * FROM series(5);
----
0
1
2
3
4
```

For more detailed usage, you can refer to the [RisingWave documentation](https://docs.risingwave.com/docs/current/udf-python/).

### Java UDFs

To use Java UDF, please make sure you have JDK 11 or above and Maven 3 or above installed in your system.

Creating a Java project for UDF is more involved compared to Python's single-file deployment. However, we have prepared a code template for you to start creating your own UDF project:

```bash
git clone <https://github.com/risingwavelabs/risingwave-java-udf-template.git>
```

To define a scalar function in Java, create a class that implements the `ScalarFunction` interface and implement a method named `eval`. The system will automatically infer the type of the SQL function based on the parameter and return value types of `eval`.

```java
import com.risingwave.functions.ScalarFunction;

public class Gcd implements ScalarFunction {
    public int eval(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

Similarly, to define a table function, create a class that implements the `TableFunction` interface. The `eval` method should return an `Iterator` to iterate over the output rows (note that this is different from the Flink API).

```java
import com.risingwave.functions.TableFunction;

public class Series implements TableFunction {
    public Iterator<Integer> eval(int n) {
        return java.util.stream.IntStream.range(0, n).iterator();
    }
}
```

Finally, register the functions and start the UDF server in the main function:

```java
import com.risingwave.functions.UdfServer;

public class App {
    public static void main(String[] args) {
        try (var server = new UdfServer("0.0.0.0", 8815)) {
            // Register functions
            server.addFunction("gcd", new Gcd());
            server.addFunction("series", new Series());
            // Start the server
            server.start();
            server.awaitTermination();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

We can directly compile and run the project using Maven:

```java
_JAVA_OPTIONS="--add-opens=java.base/java.nio=ALL-UNNAMED" mvn exec:java -Dexec.mainClass="com.example.App"
```

Or, build the project first and then run the jar file:

```java
mvn package
java -jar target/risingwave-udf-example.jar
```

After that, we can declare and use them in RisingWave:

```java
CREATE FUNCTION gcd(int, int) RETURNS int
AS gcd USING LINK '<http://localhost:8815>';

CREATE FUNCTION series(int) RETURNS TABLE (x int)
AS series USING LINK '<http://localhost:8815>';

SELECT gcd(25, 15);
----
5

SELECT * FROM series(5);
----
0
1
2
3
4
```

For more detailed usage, you can refer to the [RisingWave documentation](https://docs.risingwave.com/docs/current/udf-java/).

## How UDFs Work

As we can see, currently RisingWave runs UDFs in separate Python or Java processes. It uses the [Apache Arrow Flight RPC](https://arrow.apache.org/docs/format/Flight.html) protocol to provide computation services to RisingWave and exchanges data with RisingWave in the Arrow format. When the RisingWave compute engine encounters a UDF expression, it first converts the function input to the Arrow format, then calls the `doExchange` method of the UDF server, and finally the user-defined function is invoked on the server side using the Python or Java SDK.

The RPC of UDF works in batch mode, typically transferring data in blocks of 1024 rows. In practice, data transfer here usually does not become a performance bottleneck.

The UDF server is stateless, allowing it to be safely horizontally scaled for improved performance and availability. When RisingWave fails to connect to the UDF server, it will retry several times within a few seconds. If it still fails, it will throw an expression evaluation error. For batch queries, an error will be thrown. For streaming queries, the return value of the corresponding function will be set to NULL.
