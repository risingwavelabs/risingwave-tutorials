---
sidebar_position: 3
---

# Time Windowing

Time windows can group and partition data on a time column according to certain rules.

RisingWave supports two important types of time windows in stream processing:

- Hopping time windows
- Tumbling time windows

Readers familiar with stream processing should not be unfamiliar with these two types of time windows, so we won't go into detail here. In simple terms, just remember these key points:

* Hopping time windows have two parameters: `hop_size` and `window_size`, while tumbling time windows have only one parameter: `window_size`.
* Tumbling time windows are a special case of hopping time windows.
* Tumbling time windows are essentially hopping time windows with a `hop_size` equal to `window_size`.
* Hopping time windows allow two adjacent windows to overlap or have no overlap at all, while tumbling time windows have non-overlapping adjacent windows.

In RisingWave, the input and output of time window functions are both tables. Time windows need to specify a time column in the input table. Each row in the output table contains data for a time window, and compared to the input table's structure (schema), the output table has two additional columns: `window_start` and `window_end`, indicating the start and end of the time window.

# Sample Code

Let's say we have a stream of taxi trip data:

| trip_id | taxi_id | completed_at        | distance | duration |
| ------- | ------- | ------------------- | -------- | -------- |
| 1       | 1001    | 2022-07-01 22:00:00 | 4        | 6        |
| 2       | 1002    | 2022-07-01 22:01:00 | 6        | 9        |
| 3       | 1003    | 2022-07-01 22:02:00 | 3        | 5        |
| 4       | 1004    | 2022-07-01 22:03:00 | 7        | 15       |
| 5       | 1005    | 2022-07-01 22:05:00 | 2        | 4        |
| 6       | 1006    | 2022-07-01 22:05:30 | 8        | 17       |

You can use a tumbling time window to obtain grouping by each 2 minutes:

```sql
SELECT trip_id,  taxi_id, completed_at, window_start, window_end
FROM TUMBLE (taxi_trips, completed_at, INTERVAL '2 MINUTES');
```

Here is the result:

```sql
trip_id | taxi_id   | completed_at          | window_start          | window_end 
--------+-----------+-----------------------+-----------------------+---------------------
1       | 1001      | 2022-07-01 22:00:00   | 2022-07-01 22:00:00   | 2022-07-01 22:02:00
2       | 1002      | 2022-07-01 22:01:00   | 2022-07-01 22:00:00   | 2022-07-01 22:02:00
3       | 1003      | 2022-07-01 22:02:10   | 2022-07-01 22:02:00   | 2022-07-01 22:04:00
4       | 1004      | 2022-07-01 22:03:00   | 2022-07-01 22:02:00   | 2022-07-01 22:04:00
5       | 1005      | 2022-07-01 22:05:00   | 2022-07-01 22:04:00   | 2022-07-01 22:06:00
6       | 1006      | 2022-07-01 22:06:00   | 2022-07-01 22:06:00   | 2022-07-01 22:08:00
```

You can also use a hopping time window to calculate corresponding statistics for windows that start every minute and have a length of 2 minutes:

```sql
SELECT trip_id, taxi_id, completed_at, window_start, window_end
FROM HOP (taxi_trips, completed_at, INTERVAL '1 MINUTE', INTERVAL '2 MINUTES')
ORDER BY window_start;
```

Here is the result:

```sql
trip_id | taxi_id  | completed_at          | window_start          | window_end 
---------+---------+------------------------+-----------------------+--------------------
 1       | 1001     | 2022-07-01 22:00:00   | 2022-07-01 21:59:00   | 2022-07-01 22:01:00
 2       | 1002     | 2022-07-01 22:01:00   | 2022-07-01 22:00:00   | 2022-07-01 22:02:00
 1       | 1001     | 2022-07-01 22:00:00   | 2022-07-01 22:00:00   | 2022-07-01 22:02:00
 3       | 1003     | 2022-07-01 22:02:10   | 2022-07-01 22:01:00   | 2022-07-01 22:03:00
 2       | 1002     | 2022-07-01 22:01:00   | 2022-07-01 22:01:00   | 2022-07-01 22:03:00
 4       | 1004     | 2022-07-01 22:03:00   | 2022-07-01 22:02:00   | 2022-07-01 22:04:00
 3       | 1003     | 2022-07-01 22:02:10   | 2022-07-01 22:02:00   | 2022-07-01 22:04:00
 4       | 1004     | 2022-07-01 22:03:00   | 2022-07-01 22:03:00   | 2022-07-01 22:05:00
 5       | 1005     | 2022-07-01 22:05:00   | 2022-07-01 22:04:00   | 2022-07-01 22:06:00
 6       | 1006     | 2022-07-01 22:06:00   | 2022-07-01 22:05:00   | 2022-07-01 22:07:00
 5       | 1005     | 2022-07-01 22:05:00   | 2022-07-01 22:05:00   | 2022-07-01 22:07:00
 6       | 1006     | 2022-07-01 22:06:00   | 2022-07-01 22:06:00   | 2022-07-01 22:08:00
(12 rows)
```