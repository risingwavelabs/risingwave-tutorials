---
sidebar_position: 4
---

# Watermark

Watermark is one of the core concepts in a stream processing system. Data streams are infinite, and the watermark is used to impose limitations on these infinite data streams, guiding the system to handle data more efficiently. Watermark messages are interleaved within the data stream, and each `watermark` carries a timestamp indicating that all data up to that timestamp has arrived. RisingWave allows users to define watermark strategies on the time columns of source and append-only tables. RisingWave injects watermarks into the stream based on the defined expressions. For subsequent data that arrives later than the watermark, RisingWave filters and discards it.

For example, consider the following SQL-defined table. It defines a watermark strategy on the `time` column. Whenever data with `time = t` is inserted into the table, a watermark with a timestamp of `t - INTERVAL '5' SECOND` is injected. Records with a `time` value greater than this watermark timestamp are subsequently discarded.

```sql
CREATE TABLE t (
    v int,
    time TIMESTAMP,
    WATERMARK FOR time AS time - INTERVAL '5' SECOND
) APPEND ONLY;
```

So how does RisingWave make use of watermarks?

On one hand, RisingWave's stream processing engine employs watermarks for state management in certain queries. It helps control the size of internal computational states, preventing them from unlimited growth that might lead to performance degradation. It's worth noting that this state management, as mentioned here, is limited to the internal states of the computation engine and does not affect the data within materialized views. For data management within materialized views, please refer to the [temporal filter](./temporal_filter).

On the other hand, RisingWave introduces the concept of [EMIT ON WINDOW CLOSE (EOWC)](./eowc) based on watermarks and time windows. With the assistance of watermarks, the computation engine ensures that data within a window will no longer change. At this point, triggering computations and outputting results can significantly enhance performance, resulting in an output stream that is strictly append-only.