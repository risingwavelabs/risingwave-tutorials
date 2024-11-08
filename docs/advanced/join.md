---
sidebar_position: 2
---

# Join

In this article, we discuss how to perform join operations on data streams within RisingWave.

When using traditional databases, users can perform ad-hoc join queries between:

* tables
* materialized views
* tables and materialized views

Compared to traditional databases, RisingWave not only supports ad-hoc join queries, but also supports continuous streaming joins. Additionally, since RisingWave supports _source_, users can actually perform join operations among tables, materialized views, and sources.

For example, let's assume we have the following definitions:

```sql
create table t1 with (...);
create table t2 with (...);
create source s1 with (...);
create source s2 with (...);
create materialized view mv1 as select ...;
create materialized view mv2 as select ...;
```

Then we can perform the following ad-hoc queries:

```sql
select ... from t1, t2 where ...;
select ... from t1, mv1 where ...;
...
```

And the following queries are not allowed:


```sql
select ... from t1, s1 where ...;
select ... from s1, mv1 where ...;
```

The reason is simple, as mentioned in the [previous article](../basics/ingestion), RisingWave's source does not persist data, so it cannot be directly queried ad-hoc by users.

The following continuous stream processing can be supported:
```sql
create materialized view m1 as 
	select ... from t1, t2 where ...;
create materialized view m2 as 
	select ... from t1, mv1 where ...;
create materialized view m3 as 
	select ... from t1, s1 where ...;
create materialized view m4 as 
	select ... from s1, mv1 where ...;
```

With these basic concepts, let's start exploring the types of relationships supported by RisingWave.

## Commonly Used Join Types

In PostgreSQL, the most commonly used join types include:

* Inner join
* Left join
* Right join
* Full outer join
* Natural Join
* Cross Join
* Self Join

RisingWave supports ad-hoc queries with all these join types, but does not support continuous queries for some join types. Why is that?
The reason is that in stream processing, queries with nested loop joins have excessively high complexity, leading to poor performance, and there are fewer real-world use cases for them, hence they are not supported.


|  | Support ad-hoc queries<br />(`select` statement) | Support streaming queries<br />(`create materialized view` statement) |
| :: | :: | :: |
|  Inner join   | yes       | must be equal-join |
|  Left join  | yes        | must be equal-join |
|  Right join  | yes        | must be equal-join |
|  Full outer join  | yes        | must be equal-join |
|  Natural join  | yes        | yes |
|  Cross join  | yes        | no |
|  Self join  | yes        | must be equal-join |


If users indeed want to use non-equal join relations in stream processing queries, they might consider using [dynamic filtering](https://docs.risingwave.com/docs/current/sql-pattern-dynamic-filters/)。

