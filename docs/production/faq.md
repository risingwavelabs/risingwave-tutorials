---
sidebar_position: 2
---

# Common Issues in Production Environment

##Out-of-Memory (OOM)

In a production environment, the most likely issue encountered in RisingWave is memory overflow or Out-of-Memory (OOM). Many users might wonder: RisingWave is written in Rust to ensure memory safety, and it uses a decoupled compute-storage architecture to store internal states remotely, so why would memory overflow still occur?

In reality, in any database system, memory could be consumed by multiple functional modules, including but not limited to: caching, computation, execution planning, network transmission, and so on. Although RisingWave has better storage management compared to traditional stream processing systems, in cases of insufficient resource allocation, RisingWave can still experience memory overflow.

## Backfill

In stream processing systems, backfill may be triggered when stream computation is initiated for the first time, upstream data format changes, stream computation logic changes, or during failure recovery, among other situations. Since the amount of data for backfill could be very large, the efficiency of backfill is a feature that users care about greatly.

RisingWave has made several optimizations in terms of data backfill, providing users with a better experience. One very important optimization is the ability to dynamically add nodes during the backfill process, performing backfill with high parallelism.

## Node Configuration

RisingWave uses materialized views to represent stream computation logic, and users can also directly query computation results from materialized views. As both stream computation and ad-hoc query serving could consume substantial resources, users may want to isolate the resources for the two. RisingWave supports such isolation, allowing users to configure the number and size of computation and serving nodes separately. Please contact the RisingWave development team for assistance.
