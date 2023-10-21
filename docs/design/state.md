---
sidebar_position: 1
---

# Internal State Management

Stream processing systems continuously process data streams. The core design revolves around managing the internal states during the continuous computation process. RisingWave uses remote object storage (such as S3) for persistent state storage and caches it on the local memory and disk of computation nodes. The internal state storage in RisingWave is referred to as Hummock, which is structured as an LSM tree. The compaction process within Hummock continuously sorts data and persists it to remote object storage.

Traditional stream processing systems like Apache Flink, KsqlDB, etc., adopt a compute-storage coupled architecture, where the internal state storage is localized on the computation nodes and tightly coupled with computation. Conversely, RisingWave adopts a compute-storage separated architecture, placing internal state storage remotely and decoupling it from computation. The advantage of this separation is that storage and computation can be scaled up or down independently. However, the downside is that remote storage could lead to performance degradation. To minimize the performance impact brought by this separation, RisingWave caches data locally on computation nodes. The majority of state accesses fall on this cache, ensuring high system performance.

Systems like Apache Flink, KsqlDB, etc., use RocksDB for local internal state storage on computation nodes. Both RocksDB and Hummock share an LSM tree structure, but RocksDB is for single-node storage while Hummock is for cloud-native tiered storage.

In the early design phase, RisingWave considered using RocksDB for internal state management, but various reasons led to the rejection of this option. The specific reasons include but are not limited to:

* Transitioning RocksDB from single-node storage to cloud storage would entail a significant workload.
* The compaction process in RocksDB could severely affect computation performance, and decoupling it into a separate module would be a substantial task.
* RocksDB includes various concepts, features, and designs that are not required by RisingWave, which could potentially negatively impact overall performance.
R* ocksDB is a generic storage solution and does not have awareness of the types and progress of computations in RisingWave, necessitating additional information transfer from RisingWave. For better coordination with computation, generic storage is not suitable.