---
sidebar_position: 1
---

# Architecture

RisingWave is a distributed system with the following components:

* meta node
* worker node
	* compute node
	* compact node

The meta node stores metadata, such as database names, table names, column names, materialized view names, computation progress, and so on. It acts as the brain of the entire system; loss of metadata could lead to data loss or irrecoverability across the cluster. Currently, RisingWave utilizes etcd for meta node storage. However, in some scenarios, etcd's performance falls short, and there's consideration to replace etcd with other services.

Worker nodes can be further subdivided into compute nodes and compact nodes. Among them, compute nodes are responsible for stream processing and random querying. RisingWave employs an LSM (Log-Structured Merge) tree structure to manage the internal state of computations. The LSM tree continuously compacts and packages data, transitioning it from an unordered to an ordered state. The compaction process within the LSM tree consumes a significant amount of computational resources, hence RisingWave introduces separate compact nodes to offload the compaction process, minimizing its impact on stream processing.

In reality, RisingWave has more modules, including dedicated query service nodes to handle high concurrency queries from users. Although these modules can be separated out into individual nodes, since in most scenarios users do not need to be aware of such nodes, they are not described here.