---
sidebar_position: 4
---
# Install PostgreSQL

Follow these steps to install PostgreSQL on your system:
## Step 1: Update Your Package Lists (Linux)

If you're using a Linux-based system, it's a good practice to update your package lists to ensure you're installing the latest version of PostgreSQL. Open your terminal and run:

```shell
sudo apt update
```

## Step 2: Install PostgreSQL

Now, you can install PostgreSQL. Use the following command for your specific operating system:

### On Ubuntu and Debian-based Systems:

```shell
 sudo apt-get install postgresql
```

### On CentOS and RHEL-based Systems:

```shell
sudo yum sudo apt-get install postgresql
```

### On macOS (using Homebrew):

If you're on macOS and use Homebrew, you can install PostgreSQL with:

```shell
brew install postgresql
```

## Step 3: Start and Enable PostgreSQL Service

After installation, you need to start and enable the PostgreSQL service to ensure it starts automatically on system boot. Use the following commands:

### On Ubuntu and Debian-based Systems:

```shell
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### On CentOS and RHEL-based Systems:

```shell
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### On macOS (using Homebrew):

If you're using Homebrew on macOS, PostgreSQL should start automatically upon installation. You can use the following commands to start or stop it:

```shell
brew services start postgresql
```

## Step 4: Access PostgreSQL

By default, PostgreSQL is configured to use the "postgres" user. You can access the PostgreSQL prompt with the following command:

```shell
sudo -u postgres psql
```

## Step 5: Create a Table and Perform Queries

Now that PostgreSQL is installed and you have access to the PostgreSQL prompt, let's create a sample table and perform some basic queries. You can create a table like this:

```sql
CREATE TABLE employees (
    employee_id serial PRIMARY KEY,
    first_name VARCHAR (50),
    last_name VARCHAR (50),
    department VARCHAR (50)
);
```

You can insert data into this table using the `INSERT` statement:

```sql
INSERT INTO employees (first_name, last_name, department)
VALUES ('John', 'Doe', 'HR'),
       ('Jane', 'Smith', 'Marketing');
```

And you can query the data using the `SELECT` statement:

```sql
SELECT * FROM employees;
```

These are just simple examples to get you started with PostgreSQL. You can explore more complex SQL queries and database management tasks in the official PostgreSQL documentation.

That's it! You've successfully installed PostgreSQL, created a table, and performed basic queries on it. You can now start using PostgreSQL for your database needs.
