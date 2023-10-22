---
sidebar_position: 1
---

# RisingWave in 5 Minutes

This article aims to help everyone understand what RisingWave is within **5 minutes**.

:::danger Note 1

This tutorial may not guarantee synchronization with the official documentation (based on the RisingWave 1.2.0 version released in September 2023 when this tutorial was written).  The purpose of this tutorial is to help learn RisingWave streaming database swiftly. For detailed information, readers are advised to refer to the [official documentation](https://docs.risingwave.com/).

:::

:::danger Note 2
This tutorial is still under continuous development. The latest update was on:
**October 15, 2023**.
We welcome suggestions from everyone who is interested in RisingWave, stream processing, databases, or data engineering!
:::

## What is RisingWave?

RisingWave is a distributed SQL streaming database. In simple terms, it allows users to handle stream data using a SQL database approach, performing continuous real-time stream processing, along with data storage and ad-hoc query access functionalities.

RisingWave is an open-source (Apache 2.0 license) system. It is compatible with the PostgreSQL wire protocol, meaning that users can use RisingWave just like they use PostgreSQL.

**Users can use RisingWave for**:

- Stream processing;
- Data storage;
- Random querying, especially point queries.

**Users should not use RisingWave for**：

- Transaction processing;
- Ad-hoc analytical queries that involve frequent full table scans.

In other words, **users can use RisingWave to replace**:

- Systems like Apache Flink, Apache Spark Streaming, KsqlDB, etc., for stream processing;
- System combinations like Apache Flink + Cassandra / Redis / DynamoDB.


**And should not use RisingWave to replace**:

- Systems like PostgreSQL, MySQL, CockroachDB, etc., for transaction processing;
- Systems like ClickHouse, Apache Druid, etc., for complex analytical queries;
- Systems like ElasticSearch, etc., for full-text search.


## Why Use RisingWave for Stream Processing?


On the market, there are already some well-known open-source stream processing systems, such as Apache Flink and Apache Spark Streaming. So why do we need to use RisingWave?

**RisingWave addresses several common pain points of existing stream processing systems:**

### Steep Learning Curve

Existing stream processing systems generally have a steep learning curve. It's not just challenging to get started; even after the initial learning phase, mastering core concepts and advanced features is also difficult. Many users, after diving into stream processing systems, become overwhelmed by various low-level concepts, making it hard to grasp advanced techniques like windowing, watermarking, joins, and more, ultimately hindering their ability to effectively utilize stream processing.

:::tip RisingWave's Approach
RisingWave offers a SQL interface that is compatible with PostgreSQL and enhances overall expressiveness through user-defined functions (UDFs) in languages like Python and Java. What's even more important is that RisingWave provides high-level encapsulation of underlying details, allowing users to work with it without needing to be aware of low-level implementations.
:::

### Inefficiency in Multi-Stream Joins

Many stream processing systems provide SQL interfaces, allowing users to perform multiple stream joins using SQL join operators. However, due to internal state management and implementation issues, these stream processing systems exhibit poor stability and performance when it comes to join operations. When attempting to join 5-10 streams or more, the efficiency is compromised, or the system may crash, let alone handling a larger number of streams for joins.

:::tip RisingWave's Approach
RisingWave has made significant optimizations, particularly in state management, for multiple stream join scenarios. The system maintains efficiency and stability when performing multiple stream joins, even handling 10-20 streams (or more) effectively in production environments.
:::

### Low Resource Utilization Rate

Most existing stream processing systems originated from the era of big data and employed a MapReduce-like architecture that aggressively utilizes resources for stream processing. In these systems, each streaming job operates independently, making resource allocation a challenge. Overallocation of resources is common, leading to resource wastage. Moreover, stream processing's resource usage varies with load changes, and these systems lack efficient dynamic scaling capabilities. As a result, in real production environments, users often allocate resources based on peak loads, further reducing resource utilization rate.

:::tip RisingWave's Approach

RisingWave fundamentally operates as a database. In databases, different (concurrent) queries share resources, eliminating the need for users to manage resource usage manually. Additionally, RisingWave uses a storage-compute separation architecture, making dynamic scaling straightforward.
:::

### Challenges with Dynamic Scaling

Most existing stream processing systems have weak support for dynamic scaling. This limitation is primarily due to their tight coupling of storage and computation, making smooth dynamic scaling challenging.

:::tip RisingWave's Approach

RisingWave employs a decoupled compute-storage architecture, persisting internal state in remote object storage while decoupling computation from the state. This enables near-instantaneous dynamic scaling.
:::


### Difficult to Manage Large States

In complex stream processing like windowing and joins, many systems experience a significant performance drop or even crashes. This is because these systems store state on local computing instances, and large states can lead to performance and stability issues.

:::tip RisingWave's Approach

RisingWave's decoupled compute-storage architecture ensures that the computing state is always remotely persisted, not locally. This means that RisingWave users don't need to worry about the size of internal states. To optimize performance, RisingWave only caches states in local instances.
:::

### Large Checkpoint Intervals

Stream processing systems regularly save checkpoints. In case of failures, the system can resume computation from the most recent checkpoint. The time required for recovery, known as system downtime, is directly related to checkpoint intervals. Many existing stream processing systems have checkpoint intervals of one minute or more. In real production environments, some systems use intervals of 3 minutes, 5 minutes, or even 10 minutes or more. This is because these systems' checkpoint intervals impact performance. Too frequent checkpoints reduce performance significantly, while infrequent checkpoints result in extended downtime during system failures. Such extended downtime is unacceptable for latency-sensitive applications like financial transactions, monitoring, and alerts.

:::tip RisingWave's Approach

RisingWave's internal state management decouples checkpoint frequency from performance. Users can set very short checkpoint intervals to minimize service downtime. By default, RisingWave has a 10-second checkpoint interval.
:::

### Challenges in Result Verification

Most commonly used stream processing systems do not come with storage. In other words, stream computation occurs within the stream processing system, and computation results need to be exported to external systems. This means that when users perform stream computations, data input is in external systems, data output is also in external systems, and only the computation takes place within the stream processing system. As a result, result verification is inconvenient. Additionally, existing stream processing systems run each task (job) independently, making it impossible to create tasks that consume the results of other tasks. This leads to complex task logic, making debugging and verification challenging.

:::tip RisingWave's Approach

RisingWave is a streaming database and comes with built-in storage. Stream computation results are persisted as materialized views. This means that both the computation process and its results are within RisingWave. This makes it easy for users to verify program correctness. Moreover, users can overlay materialized views on top of one another, allowing them to break down complex stream computation programs into multiple materialized views, simplifying program development and result verification.
:::


### Complex Data Stack

Due to the lack of storage in existing stream processing systems, users need to export results to external systems and set up query serving services (supporting high-concurrency queries) in external systems like Cassandra, Redis, PostgreSQL, etc. This means that users have to maintain two sets of systems. Even more challenging is that, to ensure result correctness, users must address data consistency issues between different systems, causing unnecessary complications.

:::tip RisingWave's Approach

RisingWave is a streaming database that not only stores data (including input data and computation results) but also supports high-concurrency user access to results. Users don't need to maintain two separate systems, nor do they need to worry about data consistency issues. Users can always access consistent and up-to-date results within RisingWave.
:::


### Complex System Maintenance

Existing stream processing systems expose low-level details to users, requiring them to configure resources, adjust parallelism, and fine-tune internal state parameters. While exposing these details can lead to better performance for advanced users, it presents unnecessary learning curves and the potential for inefficient system operation and crashes for most ordinary users.
:::tip RisingWave's Approach

RisingWave shields users from unnecessary low-level details. Users only need to focus on SQL code-level issues.
:::


## RisingWave's Limitations

Compared to stream processing systems like Apache Flink and Apache Spark Streaming, RisingWave **does not support programmable interfaces in languages like Java and Python**. Many experienced users of Apache Flink and Apache Spark Streaming choose to use Java or Python interfaces for programming. If existing code logic is overly complex and cannot be rewritten using SQL, RisingWave may not be suitable. However, RisingWave does support User-Defined Functions (UDFs) in languages such as Python and Java. Therefore, if your program can be represented using UDFs, you can still choose RisingWave.

While RisingWave is compatible with the PostgreSQL wire protocol, it **does not support transaction processing**. Therefore, it cannot directly replace PostgreSQL in transactional applications. Many users combine OLTP databases like MySQL and PostgreSQL with RisingWave: they use OLTP databases for transaction processing and use RisingWave to consume Change Data Capture (CDC) from the databases, performing stream processing within RisingWave.

RisingWave uses row storage at its core, making it suitable for high-concurrency point queries. However, RisingWave **is not well-suited for ad-hoc analytical queries**. To support workloads of massive amounts of ad-hoc analytical queries, users need to import data into a real-time analytical database for operations. Many users combine RisingWave with databases like ClickHouse and Apache Druid for real-time analytics: they use RisingWave for stream processing while using the real-time analytical database for analytical queries.


## RisingWave's In-Production Use Cases

Like other stream processing systems, the primary use cases of RisingWave include monitoring, alerting, real-time dashboard reporting, streaming ETL (Extract, Transform, Load), machine learning feature engineering, and more. It has already been applied in fields such as financial trading, manufacturing, new media, logistics, gaming, and more.





