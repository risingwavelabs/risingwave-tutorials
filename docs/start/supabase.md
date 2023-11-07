---
sidebar_position: 5
---

# Install PostgreSQL (via Supabase)

Supabase provides a PostgreSQL database for your project along with a range of functionalities, including authentication, backups, instant APIs, Edge Functions, real-time subscriptions, storage, and vector embeddings.

Follow these steps to set up a PostgreSQL database using Supabase:

## 1. Sign Up for a Supabase Account

Start by signing up for a free Supabase account, which will grant you access to PostgreSQL services. To create your account, visit [Supabase Account](https://supabase.com/dashboard/sign-up).

![1](https://github.com/fahadullahshah261/risingwave-tutorials/assets/99340455/3ec1d1bc-c499-415e-8144-a61d8ada07c4)


## 2. Create Your First Supabase Project

Enter the name of the organization, and select "New Project" and assign a name, password, and region to your first Supabase project. You will receive connection details such as the project API for your new Supabase project, so be sure to save them for later use when connecting to your PostgreSQL project.

![2](https://github.com/fahadullahshah261/risingwave-tutorials/assets/99340455/15e68f3c-0854-4f0b-a095-cc3431f43008)

## 3. Connect to Your Supabase Project

After deploying the database, you can use it as a spreadsheet with the Table Editor or utilize the SQL Editor for more advanced functions. You can also interact with the Supabase database using client libraries.

![3](https://github.com/fahadullahshah261/risingwave-tutorials/assets/99340455/baae1c34-388d-4a8f-9587-753dd9b82399)


Now, the Table Editor is as follows:

![4](https://github.com/fahadullahshah261/risingwave-tutorials/assets/99340455/5fe9c935-dcc7-4184-b0f1-23ec25e26423)


For more information about Supabase, please refer to [Supabase's official documentation](https://supabase.com/docs).

# Connect Supabase with RisingWave 

RisingWave Cloud provides fully managed cloud hosted RisingWave, an easy-to-use, cost-efficient, secure, and highly scalable stream processing database with an intuitive and user-friendly interface, ensuring a seamless user experience.

Create a RisingWave cluster within [RisingWave Cloud](https://cloud.risingwave.com/) using RisingWave free-tier account.
After succesfully deploying RisingWave cluster, create a source table in RisingWave SQL editor as:

```sql
CREATE TABLE employees(
-- The same columns in 'employees' table in Supabase
    employee_id INT,
    first_name VARCHAR,
    last_name VARCHAR,
    department VARCHAR,
    PRIMARY KEY (employee_id)
)

WITH(
  connector='postgres-cdc',
  hostname = 'https://xxxx.supabase.co',
  port = '5432',
  username = 'postgres',
  password = 'xxxx',
  database.name = 'postgres',
  schema.name = 'public',
  table.name = 'employees',
  publication.name = 'rw_publication' -- Database Replications name in Supabase
);
```
After successfully creating a source table in RisingWave, you can query it as:

```sql
SELECT * FROM employees;
```
Congratulations, you have successfully ingested data from Supabase, and then, query the data in the RisingWave.

For more detailed information related to PostgreSQL CDC, please refer to [RisingWave Documentation](https://docs.risingwave.com/docs/current/ingest-from-postgres-cdc/).
