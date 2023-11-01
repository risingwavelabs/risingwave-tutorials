---
sidebar_position: 5
---

# EMIT ON WINDOW CLOSE


In stream processing, because the input stream is unbounded, stream processing engines can have different computation triggering strategies to determine when to compute and output results. Currently, RisingWave supports specifying two different triggering strategies when creating materialized views and sink tasks in stream processing:

* **EMIT ON UPDATE**: Whenever the upstream table changes, it computes the corresponding changes in the result. This is also the default behavior when no triggering strategy is specified;

* **EMIT ON WINDOW CLOSE**: For some queries with [time windows](./window.md), if there is a [watermark](./watermark.md) on the time column, the computation engine can determine that some data within certain time windows will not change in the future, meaning that these windows are closed. `EMIT ON WINDOW CLOSE` triggers the computation of this immutable data only when the window is closed, allowing it to produce append-only results.


## Sample Code

For example, the following SQL query creates a table with a 5-second timeout watermark and creates a streaming query on the table to compute a count per minute. The `EMIT ON WINDOW CLOSE` at the end of the statement specifies that the computation is triggered when the materialized view's window closes.

```SQL
CREATE TABLE t (
    v1 int,
    v2 int,
    time TIMESTAMP,
    WATERMARK FOR time AS time - INTERVAL '5' SECOND
) APPEND ONLY;

CREATE MATERIALIZED VIEW window_count AS
SELECT 
    window_start, COUNT(*)
FROM TUMBLE(events, event_time, INTERVAL '1' MINUTE)
GROUP BY window_start
EMIT ON WINDOW CLOSE;
```

When a new record with a timestamp of `22:01:06` is added to the table `t`, a watermark message with a value of `22:01:01` is emitted. After this point, data in the table where `time <= 22:01:01` will no longer change. At this moment, computations will be performed for results with `window_end <= 22:01:00`, such as `(21:59:00, 22:00:00)`` and `(22:00:00, 22:01:00)`.

## Advantages of EMIT ON WINDOW CLOSE

So, in what situations should you choose to trigger on window close? There are two main application scenarios:

* **Append-Only Requirement for Downstream Systems**: Some downstream systems only support append-only writes, such as Kafka, S3, and others that do not support deletes and updates. In such cases, when creating a sink, you can choose to use `EMIT ON WINDOW CLOSE` to avoid the need for deletes and updates.

* **Better Performance**: For certain computations like window functions and percentiles, incremental maintenance can be inefficient. In such cases, using `EMIT ON WINDOW CLOSE` allows RisingWave to perform internal batching or convert it into bounded computations. Currently, using `EMIT ON WINDOW CLOSE` in scenarios involving SQL's OVER window functions and time window aggregation can result in better performance.

Example of time window aggregation:

```SQL
CREATE MATERIALIZED VIEW mv AS
SELECT
    window_start, MAX(v1), SUM(v2)
FROM TUMBLE(events, time, INTERVAL '1 hour')
GROUP BY window_start
EMIT ON WINDOW CLOSE;
```
Example of OVER window function:

```SQL
CREATE MATERIALIZED VIEW mv2 AS
SELECT
    time, v1, v2,
    LEAD(v1, 1) OVER (PARTITION BY v2 ORDER BY time) AS l1,
    LEAD(v1, 3) OVER (PARTITION BY v2 ORDER BY time) AS l2
FROM events
EMIT ON WINDOW CLOSE;
```