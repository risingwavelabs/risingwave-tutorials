---
sidebar_position: 5
---

# Data Delivery

Some users wish to use RisingWave for stream processing and then deliver the computed results to downstream systems. This is a common stream ETL scenario.
In RisingWave, users can directly use the [`CREATE SINK` statement](https://docs.risingwave.com/docs/current/sql-create-sink/) to achieve data delivery.

## Sample Code

Let's take a quick look at how RisingWave delivers data. For simplicity, we will use Apache Kafka as the downstream destination.

### Preparing Data

First, we create a `table` and import data using the `datagen` tool:

```sql
CREATE TABLE t1 (v1 int, v2 int)
WITH (
     connector = 'datagen',
     fields.v1.kind = 'sequence',
     fields.v1.start = '1',
     fields.v2.kind = 'random',
     fields.v2.min = '-10',
     fields.v2.max = '10',
     fields.v2.seed = '1',
     datagen.rows.per.second = '10'
) ROW FORMAT JSON;
```

Let's verify if the creation was successful:

```sql
SHOW TABLES;
```

Output:

```sql
 Name
------
 t1
(1 row)
```

After creating `t1` for some time, we can use the `SELECT` statement to query `t1`:

```sql
SELECT COUNT(*) FROM t1;
```

### Delivering Data

First, we need to start Apache Kafka on localhost, listening on port 9092 (local deployment of Apache Kafka can be achieved using Docker Compose, specific steps are omitted here). Next, we can deliver the data from the table directly to the downstream by creating a `sink`:

```sql
CREATE SINK test_sink
FROM t1 
WITH (
        properties.bootstrap.server = 'localhost:9092',
        topic = 'test_sink_topic',
        connector = 'kafka',
        primary_key = 'v1'
)
FORMAT UPSERT ENCODE JSON;
```

Here, we specify `FORMAT UPSERT ENCODE JSON` to indicate that RisingWave will use UPSERT to output JSON-formatted messages to Kafka. In the `primary_key`, we specify `v1` as the key for the downstream Kafka messages.

Let's check if the sink was created successfully:

```sql
SHOW SINKS;
```

Output (the numbers shown may be completely different):

```sql
Name 
------
 test_sink
(1 row)
```

Using the console, let's query the content of the Kafka topic `test_sink_topic`:

```sql
> kafkacat -b localhost:9092 -C -t test_sink_topic -J                                                                                                                                                                                                                                                      
```

Output (data will continue to be sent to Kafka until datagen stops):

```sql
{"topic":"test_sink_topic","partition":0,"offset":0,"tstype":"create","ts":1700201806289,"broker":-1,"key":"{\"v1\":1}","payload":"{\"v1\":1,\"v2\":7}"}
{"topic":"test_sink_topic","partition":0,"offset":1,"tstype":"create","ts":1700201806289,"broker":-1,"key":"{\"v1\":2}","payload":"{\"v1\":2,\"v2\":5}"}
...

```

RisingWave also supports deliver the results of stream calculations to downstream systems. This can be achieved using either `CREATE SINK FROM <materialized view>` or `CREATE SINK AS <query>`.

## Continue Reading

[Connector - Sink](/docs/basics/connector.md#sink): Learn more about the supported data formats, encoding formats, and data delivery methods.