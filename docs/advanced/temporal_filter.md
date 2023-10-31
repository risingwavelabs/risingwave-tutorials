---
sidebar_position: 5
---

# Temporal Filter

The data streams processed by RisingWave are infinite. However, in many cases, users are only interested in data from a recent period (such as the past 1 hour, 1 day, or 1 week). Storing and processing unnecessary expired data is often unnecessary and a waste of resources. In some other systems, users are often allowed to define a Time-To-Live (TTL) to eliminate expired data, but the definitions can be vague, and the specific elimination time is unclear. Users also find it challenging to precisely specify the target states to eliminate. RisingWave provides a temporal filter syntax in SQL to help users eliminate expired data.

The temporal filter in SQL is represented as a predicate filtering condition, which includes a relationship between now() and a time column in the source table.

For example, if you just want to process data that is generated within a week, then you may write the query like:

```sql
CREATE MATERIALIZED VIEW MV AS
SELECT * FROM sales 
WHERE sale_date > NOW() - INTERVAL '1 week';
...
```