---
sidebar_position: 2
---

# Fun Questions

Upon first learning RisingWave, readers from different backgrounds often ask many interesting questions. In this article, we summarize some common questions.


## Can RisingWave replace Flink SQL?

RisingWave's capabilities are a superset of Flink SQL. So, Flink SQL users can relatively easily migrate to RisingWave. However, it's important to note that there are still some subtle differences in syntax between RisingWave and Flink SQL, so users may need to rewrite some queries.

Of course, RisingWave employs PostgreSQL syntax, which is believed to have a much lower learning and usage barrier compared to Flink SQL.


## Is RisingWave a unified batch and streaming system?

The term "unified batch and streaming" was initially used to describe computing platforms like Apache Spark and Apache Flink, rather than databases. But if we apply this concept to databases, then stream processing refers to the continuous incremental computation on newly inserted data, while batch processing refers to random batch computation on already stored data. RisingWave clearly supports both stream processing and batch processing.

It's worth noting that RisingWave excels in stream processing. In terms of storage format, since RisingWave uses row storage, it is more suitable for point queries on stored data rather than full table scans. Therefore, if users have a high demand for random full table analytic queries, we recommend using real-time analytic databases like ClickHouse or Apache Druid.

## Does RisingWave support transaction processing?

RisingWave doesn't support read-write transactions but does support read-only transactions. It can't replace PostgreSQL for transaction processing. This design is mainly because, in real-world scenarios, users typically need to use dedicated transactional databases to support online businesses. Supporting both transaction processing and stream processing within the same database would make the load handling of the database extremely complex, making it hard to optimize both aspects.

In production, the best practice is to use RisingWave as a downstream system of the transactional database. RisingWave reads serialized data from the transactional database through CDC.


## Why does RisingWave use row storage for table storage?

RisingWave uses the same storage system to support internal state management and data storage. In internal state management, all types of operators are more suited to use row storage, and in data storage, as users are more likely to perform random point queries, row storage is also more appropriate. In the future, RisingWave may periodically convert row storage to column storage to better support random analytic queries.




## Can streaming databases be considered a combination of stream processing engine + database?

Functionally, developers can indeed use a stream processing engine (like Apache Flink) combined with a database (like PostgreSQL) to simulate a streaming database. However, this combination may encounter significant problems in practice.

* From a design perspective, streaming databases use the same set of storage for internal state management, result storage, and random querying. Independent databases are clearly not suitable for internal state storage as frequent cross-system data access incurs a huge overhead, which is not desirable for latency-sensitive systems like stream processing systems. In fact, early distributed stream processing engines like Apache Storm and Apache S4 tried this approach, but it was not ultimately successful.
* From an implementation perspective, ensuring consistency between two independent systems requires establishing a framework to ensure consistency even if one system crashes. Implementing this framework obviously requires more engineering input.
* From an operations perspective, it's clear that operating two different systems brings very high operational costs.
* From a user experience perspective, the experience of using two systems is significantly different from using a single system.


## What's the difference between streaming databases and real-time OLAP databases?

Mainstream streaming databases include RisingWave, KsqlDB, etc., while mainstream real-time OLAP databases include ClickHouse, Apache Druid, etc.

In both streaming and real-time OLAP databases, users can support predefined queries through materialized views, or send random queries directly. Streaming databases excel in supporting predefined queries, while real-time OLAP databases excel in supporting random queries. This difference leads to the distinction in specific use cases between streaming databases and real-time OLAP databases.

Streaming databases are mainly used for monitoring, alerting, real-time dynamic reporting, etc., while real-time analytic databases are mainly used for interactive reporting, etc. At the same time, streaming databases are also used for stream ETL operations.


## How are the materialized views in streaming databases different from those in real-time OLAP databases?

Due to the different focuses of streaming databases and real-time OLAP databases, their materialized views seem the same but are actually significantly different.

In streaming databases like RisingWave, materialized views are a core capability. Materialized views in these systems need to present consistent, fresh computation results after stream processing, while in real-time OLAP databases like ClickHouse, materialized views are auxiliary capabilities. Real-time OLAP databases often use a "best effort" approach to update materialized views. Meanwhile, materialized views in streaming databases also implement various advanced stream processing semantics.

To summarize, materialized views in streaming databases like RisingWave have the following important features:

* **Real-time**: Many databases update materialized views asynchronously or require users to update them manually. But in RisingWave, materialized views are updated synchronously, so users can always query the freshest results. Even for complex queries with join, windowing, etc., RisingWave can efficiently handle them synchronously, ensuring the freshness of materialized views.
* **Consistency**: Some databases only provide eventually consistent materialized views, meaning the results on materialized views seen by users are approximate or erroneous. Especially when users create multiple materialized views, due to different refresh strategies for each materialized view, it's hard to see consistent results across materialized views. However, materialized views on RisingWave are consistent; even when accessing multiple materialized views, users will always see correct results, without inconsistencies.

* **High Availability**: RisingWave persists materialized views and sets high-frequency checkpoints to ensure rapid fault recovery. When the physical nodes hosting RisingWave crash, RisingWave can achieve second-level recovery and update computation results to the latest state within seconds.

* **Stream Processing Semantics**: In the stream processing domain, users can use higher-order syntax, like time windows, watermarks, etc., to process data streams. Traditional databases do not have these semantics, so users often rely on external systems to handle these semantics. RisingWave is a stream processing system, equipped with various complex stream processing semantics, allowing users to operate with SQL statements.

