---
sidebar_position: 1
---

# Data Ingestion

In databases, users often use the `insert` statement to input data. However, in stream processing, data is continuously imported from upstream systems, and evidently, the insert statement is unable to meet this need. RisingWave allows users to directly create _table_ and _source_ to import upstream data. When there is new data entering from the upstream systems, RisingWave will directly consume the data and carry out incremental computations.

Common upstream data source systems for RisingWave include:

* **Messaging systems**, such as Apache Kafka, Apache Pulsar, Redpanda, and so on;
* **Operational databases**, like MySQL, PostgreSQL, MongoDB, and so on;
* **Storage systems**, like AWS S3, and so on.

Readers can refer to the [official documentation](https://docs.risingwave.com/docs/current/rw-integration-summary/) to understand all supported data sources.




## _table_ and _source_

In RisingWave, users can use the following statements to create _table_ or _source_, thereby establishing a connection with upstream systems.

```sql
CREATE {TABLE | SOURCE} source_or_table_name 
[optional_schema_definition]
WITH (
   connector='kafka',
   connector_parameter='value', ...
)
...
```

After creating a table or source, RisingWave will continuously consume data from the upstream system.


| Functionalities | `table` | `source` |
| :: | :: | :: |
| Support persisting data     | yes       | no |
| Support primary key   | yes        | yes |
| Supports appending data  | yes        | yes |
| Supports updating/deleting data   | yes, but a primary key needs to be defined       | no |

A very fundamental difference between table and source is that table will persist the consumed data, while source will not.

For instance, if the upstream inputs 5 records: `AA` `BB` `CC` `DD` `EE`, if using table, these 5 records will be persisted within RisingWave; if using source, these records will not be persisted.

The significant advantage of using table to persist records is that it can speed up queries. Naturally, if the data is within the same system, queries will be much more efficient, although the downside is that it occupies storage. Another advantage is the ability to consume data changes. That is to say, if the upstream system deletes or updates a record, this operation will be consumed by RisingWave, thereby modifying the results of the stream computation. On the other hand, source only supports appending records and cannot handle data changes.

Of course, to allow table to accept data changes, a primary key must be specified on the table.

## Sample Code

Now let's quickly verify RisingWave's data import capability. Since RisingWave trial mode does not support database CDC (at least Docker deployment mode is required), it's more suitable to choose Apache Kafka as the upstream message source. If you don't have Kafka, that's not a problem, we can directly use RisingWave's built-in [datagen tool](https://docs.risingwave.com/docs/current/create-source-datagen/) for simulation.

### Ingest data


We will create a table and a source separately, and use the datagen tool to ingest data:

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

CREATE SOURCE s1 (w1 int, w2 int) 
WITH (
     connector = 'datagen',
  
     fields.w1.kind = 'sequence',
     fields.w1.start = '1',
  
     fields.w2.kind = 'random',
     fields.w2.min = '-10',
     fields.w2.max = '10',
     fields.w2.seed = '1',

     datagen.rows.per.second = '10'
 ) ROW FORMAT JSON;
```

Let's verify whether the creation was successful:


```sql
show tables;
```

We should get:
```sql
 Name
------
 t1
(1 row)
```


```sql
show sources;
```

We should get:
```sql
 Name
------
 s1
(1 row)
```


Note that if we use the PostgreSQL shortcut command `\d`, we will only see `t1` and not `s1`. This is because source is not a relation as defined by PostgreSQL. To ensure compatibility with various PostgreSQL tools, RisingWave does not display source as a relation.

After creating `t1` and `s1` for a while, we use the select statement to query `t1` and `s1`:

```sql
select count(*) from t1;
```

Received results (the exact number may vary):

 ```sql
 count
-------
  8780
(1 row)
 ```

If we run:
```sql
select count(*) from s1;
```

Received results:
```sql
ERROR:  QueryError: Scheduler error: Unsupported to query directly from this source
```

This result is as expected. Because in RisingWave, table will persist data, while source will not, so users cannot query the source results.

:::tip Why is it designed this way?
Some users do not want to persist data in RisingWave. However, if the data is not persisted in RisingWave, RisingWave cannot obtain **ownership** of the data. If random querying of source data is supported, it means that RisingWave is required to directly read the data stored in the upstream system. This cross-system data read is likely to cause data inconsistency issues, as RisingWave cannot determine whether there are other users in the upstream system who are writing data concurrently. Furthermore, frequent cross-system access can cause a significant drop in system performance. To ensure consistency and performance, RisingWave does not support random querying of source.

Of course, as you may have seen, some databases, like PostgreSQL (requires plugin), support random access to external data sources. RisingWave does not currently support such random access, but it may be added to the long-term development plan. If you have a need for this feature, you are welcome to propose and discuss it with us.
:::

### Stream processing in action

Then let's start creating materialized views for stream processing. We create materialized views on top of `t1` and `s1`:

```sql
create materialized view mv_t1 as select count(*) from t1;
create materialized view mv_s1 as select count(*) from s1;
```

We then run:
```sql
select * from mv_t1;
```

Received results (the exact number may vary):
```sql
 count
-------
 12590
(1 row)
```

We run:
```sql
select * from mv_s1;
```

Received results (the exact number may vary):
```sql
 count
-------
   320
(1 row)
```

You might be surprised by the results: even though mv_t1 and mv_s1 were created almost at the same time, and the data in t1 and s1 is similar, why are the results significantly different?

The reason is that when the table is created, RisingWave starts consuming data from upstream and persists it internally. If a materialized view is created on the table at any time, the new materialized view will start reading from the oldest data in the table and perform stream computation.
On the other hand, when the source is created, RisingWave does not immediately consume data from upstream. It's only when a materialized view is created on that source that RisingWave begins to consume data from the corresponding upstream source.

Returning to the example, the moment t1 is created, RisingWave starts consuming data from upstream (which is the datagen corresponding to t1) and persists it in t1. When mv_t1 is created, RisingWave reads the data already saved in t1 and continues to consume data from datagen. However, when s1 is created, RisingWave does not immediately consume data. It's only when mv_s1 is created that RisingWave starts consuming upstream data. Hence, we see different results.