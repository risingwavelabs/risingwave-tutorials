---
sidebar_position: 1
---

# RisingWave in 10 Minutes

This article aims to help everyone understand what RisingWave is within **10 minutes**.

:::note Note 1

This tutorial may not guarantee synchronization with the official documentation. This tutorial is based on the RisingWave version 1.3.0 released in October 2023 when this tutorial was initially created. The purpose of this tutorial is to help interested users jump start on learning RisingWave streaming database. For detailed information, readers are advised to refer to the [documentation](https://docs.risingwave.com/).

:::

:::note Note 2
This tutorial is still under continuous development. The latest update was on:
**November 20, 2023**.
We welcome suggestions from everyone who is interested in RisingWave, stream processing, databases, or data engineering!
:::

## What is RisingWave?

RisingWave is a distributed SQL streaming database that enables simple, efficient, and reliable processing of streaming data. It is open-sourced under Apache 2.0 license. It allows developers to perform stream processing in the same way as they operate a database. Developers can express intricate processing logic through materialized views, and query materailized views to get always up-to-date and consistent results.

<img
  src={require('./img/new_archi_grey.png').default}
  alt="RisingWave Architecture"
/>

**Users can use RisingWave for**:

- Stream processing;
- Data storage;
- Random querying, especially point queries.

**Users should not use RisingWave for**：

- Transaction processing;
- Ad-hoc analytical queries that involve frequent full table scans.

## Real-time materialized views and stream processing

Real-time materialized views are a core concept in RisingWave. In RisingWave, materialized views have characteristics such as consistency, persistence, and high concurrent query access. They are maintained through continuous incremental stream computation. Users define materialized views to express stream computation logic and access the consistent results through querying the materialized views.

RisingWave allows users to create cascading materialized views, meaning users can define materialized views on top of other materialized views. Additionally, all materialized views are directly accessible to users. This capability significantly reduces the complexity of developing stream processing applications.

When developing applications using traditional stream processing engines like Apache Flink or Apache Spark Streaming, users often need to connect multiple instances of a stream processing engine with multiple instances of message queues to express complex logic. To query the results, users must export the stream processing results to a dedicated downstream database and perform queries there. This architecture is complex, incurs high operational costs, and requires users to take responsibility for the consistency of computation results across systems.

The diagram below illustrates the situation when building applications using traditional stream processing engines. Developers need to manage multiple systems and handle the consistency relationships between them.

<img
  src={require('./img/without_risingwave.png').default}
  alt="RisingWave Architecture"
/>

When using RisingWave, users only need to focus on constructing materialized views and can reduce development complexity by splitting complex logic into multiple cascading materialized views. RisingWave guarantees the consistency, persistence, and high concurrent query access of materialized views. Users only need to manage a RisingWave cluster, as RisingWave ensures the consistency between different materialized views.

The diagram below illustrates the situation when developing applications using the RisingWave stream database. Developers only need to manage a single system and do not need to consider any relationships between different system components.

<img
  src={require('./img/with_risingwave.png').default}
  alt="RisingWave Architecture"
/>

## Why RisingWave for materialized views?

If you have experience with databases, you have likely encountered materialized views in various types of databases. Traditional databases like PostgreSQL, data warehouses like Redshift and Snowflake, and real-time analytics databases like ClickHouse and Apache Pinot, all have materialized views. However, RisingWave's materialized views have the following important characteristics that differentiate them from materialized views in other databases:

### Real time

Many databases update materialized views asynchronously or require manual updates from users. In RisingWave, materialized views are updated synchronously, ensuring users always have access to the most up-to-date results. Even with data changes, deletions, or complex queries involving joins and windowing, RisingWave can efficiently synchronize and maintain the freshness of materialized views.

### Consistency

Some databases only offer eventually consistent materialized views, meaning the results seen by users are approximate or contain errors. Especially when users create multiple materialized views, it becomes challenging to achieve consistency across them due to different refresh strategies. In contrast, RisingWave's materialized views are consistent. Regardless of accessing multiple materialized views, users always see correct and consistent results, avoiding any inconsistencies.

### High availability

RisingWave persists materialized views and employs frequent checkpoints to ensure fast recovery in case of failures. When a physical node hosting RisingWave experiences a failure, RisingWave achieves sub-second recovery and updates the computation results to the latest state within seconds.

### High concurrency

RisingWave supports high-concurrency ad-hoc queries. By persisting data in remote object storage in real-time, users can dynamically configure the number of query nodes based on the workload, efficiently supporting business demands.

### Stream processing semantics

In stream processing, users can leverage advanced syntax such as time windows and watermarks to process data streams. Traditional databases lack these semantics, often requiring users to rely on external systems to handle such semantics. RisingWave is a stream processing system that comes with various complex stream processing semantics and allows users to operate using SQL statements.

### Resource isolation

Materialized views involve continuous stream computation and consume significant computational resources. To prevent interference between materialized view computations and other calculations, some users transfer the materialized view functionality from OLTP or OLAP databases to RisingWave to achieve resource isolation.

## Why RisingWave for stream processing?

If you have experience with stream processing systems, you are likely familiar with open-source stream processing systems such as [Apache Flink](https://flink.apache.org/), [Apache Spark Streaming](https://spark.apache.org/docs/latest/streaming-programming-guide.html), and [KsqlDB](https://ksqldb.io/). So why do we need to use RisingWave?

In addition to significantly reducing the complexity of developing stream computing applications, RisingWave focuses on two main aspects compared to other stream processing systems: **Ease-of-use** and **cost efficiency**. In simple terms:

RisingWave provides a **[PostgreSQL](https://www.postgresql.org/)-style interaction experience** for stream processing, greatly lowering the barrier to entry for using stream computing technologies.

Similar to [Snowflake](https://snowflake.com/), RisingWave implements an architecture that decouples storage and compute, resulting in a significant reduction in computation and storage costs.

From an ease-of-use perspective, RisingWave offers the following key features:

### Simple to learn

:::info Problems with existing stream processing systems

Existing stream processing systems have steep learning curves, making it difficult not only to get started but also to learn core concepts and advanced features. Many users, after diving into stream processing systems, find themselves overwhelmed by various underlying concepts and struggle to master advanced techniques such as windowing, watermarking, and joins. This makes it challenging for them to effectively utilize stream computing.

:::

RisingWave speaks PostgreSQL-style SQL, enabling users to dive into stream processing in much the same way as operating a PostgreSQL database. It enhances overall expressiveness through user-defined functions (UDFs) in languages like Python and Java. More importantly, RisingWave encapsulates underlying details, freeing users from the need to understand the low-level implementation.

### Simple to develop

:::info Problems with existing stream processing systems

Current popular stream processing systems do not come with storage. This means that stream computations occur within the stream processing system, and the computation results need to be exported to other systems. In other words, if users perform stream computing, the data input and output reside in external systems, while the computation takes place within the stream processing system. As a result, result validation becomes inconvenient. Moreover, existing stream processing systems run each task (job) independently and cannot directly consume the results of other tasks. This leads to complex task logic, making it difficult to debug and verify correctness.

:::

RisingWave is a stream database that includes storage. Stream computation results are persisted as materialized views. This means that both the computation process and results are within RisingWave. This allows users to easily verify data correctness. Additionally, users can define materialized views based on other materialized views, meaning complex stream computing programs can be decomposed into multiple materialized views, simplifying program development and result validation.

### Simple to integrate

:::info Problems with existing stream processing systems

Most existing stream processing systems were developed during the era of big data and have good integration with various big data systems. However, with the advent of the cloud era, numerous open-source and proprietary systems and tools have emerged. Integrating these emerging systems requires a significant amount of engineering effort and results in complex maintenance.

:::

With integrations to a diverse range of cloud systems and the PostgreSQL ecosystem, RisingWave boasts a rich and expansive ecosystem, making it straightforward to incorporate into existing infrastructures.

From a cost efficiency perspective, RisingWave provides the following key features:

### Highly efficient in complex queries

:::info Problems with existing stream processing systems

When performing complex stream computations such as windowing and joins, many systems experience severe performance degradation or even crashes. This is because in these systems, the state is stored on local compute instances, and when the state becomes too large, it leads to performance and stability issues. For example, when users attempt to join multiple (e.g., 5-10) data streams using these systems, they often encounter low efficiency or even the inability to run, let alone joining more streams.

:::

RisingWave adopts a storage-compute decoupled architecture that persists the computation state remotely instead of locally. This relieves RisingWave users from concerns about the size of internal states. To achieve optimal performance, RisingWave only caches the state in local instances. At the same time, RisingWave has made significant optimizations for complex scenarios like multi-stream joins, especially in the aspect of state management, using more refined management patterns to ensure high efficiency and stability. In production scenarios, RisingWave performs well in handling joins of 10-20 (or even more) streams.

### Transparent dynamic scaling

:::info Problems with existing stream processing systems

In most existing stream processing systems, support for dynamic scaling is weak. The main reason for this is the adoption of a coupled storage-computation architecture, where the internal state storage is tightly coupled with the computation. This prevents smooth implementation of dynamic scaling.

:::

RisingWave adopts a storage-compute decoupled architecture, where the internal state of computations is persisted in remote object storage, and the computation is not bound to the internal state. This enables dynamic scaling to be achieved in seconds.

### Instant failure recovery

:::info Problems with existing stream processing systems

Stream processing systems periodically save checkpoints. When a failure occurs, the system only needs to resume computation from the most recent checkpoint. The recovery time, or the time it takes for the system to recover, is directly related to the checkpoint interval. In most existing stream processing systems, the checkpoint interval is set to 1 minute or longer. In practical production environments, many systems configure checkpoints at intervals of 3 minutes, 5 minutes, or even 10 minutes or more. This is because the checkpoint interval in these systems affects performance: a smaller interval significantly decreases performance, while a larger interval results in longer recovery time when a system failure occurs. Such extended downtime is unacceptable for latency-sensitive applications like financial transactions, monitoring, and alerts.

:::

RisingWave's internal state management decouples the checkpoint frequency from performance. This means that users can set a very small checkpoint interval to minimize service downtime. By default, RisingWave has a checkpoint interval of 10 seconds.

## RisingWave's limitations

RisingWave isn’t a panacea for all data engineering hurdles. It has its own set of limitations:

Compared to stream processing systems like Apache Flink and Apache Spark Streaming, RisingWave **does not support programmable interfaces such as Java and Python**. Many experienced users of Apache Flink and Apache Spark Streaming choose to use Java, Python, and other interfaces for programming. If your existing code logic is too complex and cannot be rewritten using SQL, RisingWave may not be suitable for your use case. However, RisingWave does support user-defined functions (UDFs) in languages like Python and Java. So, if your program can be expressed using UDFs, you can still consider using RisingWave.

Although RisingWave is compatible with the PostgreSQL protocol, it **does not support transaction processing**. Therefore, it cannot be used as a direct replacement for PostgreSQL in transactional applications. Many users combine OLTP databases like MySQL and PostgreSQL with RisingWave: they use the OLTP database for transaction processing and consume the database's change data capture (CDC) in RisingWave for stream processing.

RisingWave's underlying storage is row-based and suitable for high-concurrency point queries. However, RisingWave is **not suitable for ad-hoc analytical queries**. To support ad-hoc analytical queries, users need to import data into an OLAP database for operations. Many users combine RisingWave with OLAP databases like ClickHouse and Apache Pinot: they use RisingWave for stream processing while utilizing the OLAP database for analytical queries.

## In-production use cases

Like other stream processing systems, the primary use cases of RisingWave include monitoring, alerting, real-time dashboard reporting, streaming ETL (Extract, Transform, Load), machine learning feature engineering, and more. It has already been adopted in fields such as financial trading, manufacturing, new media, logistics, gaming, and more.
