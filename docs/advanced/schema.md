---
sidebar_position: 7
---

# Schema Change

Schema changes in a database are particularly important. In a production environment, we may undergo table schema changes every few weeks or months. Since stream processing systems are often used as downstream systems for database systems, how to respond to upstream database schema changes is a common issue for stream processing systems.

RisingWave itself is a stream processing system and a database. Therefore, it not only needs to consider how to handle upstream database schema changes but also how its own schema can change. As a downstream system, RisingWave allows users to manually specify the required columns when synchronizing tables from the upstream system. Therefore, it does not automatically sync upstream database schema changes; these changes need to be manually made using the [`ALTER TABLE`](https://docs.risingwave.com/docs/dev/sql-alter-table/) syntax.

To better understand how RisingWave handles schema changes, let's assume a RisingWave instance with an upstream PostgreSQL database. RisingWave connects and synchronizes a table from the PostgreSQL database using the Change Data Capture (CDC) method. This table is named `table_pg` in PostgreSQL and `table_rw` in RisingWave. We then create a materialized view `mv_rw` on `table_rw`.

### Adding a Column

To avoid data loss with the newly added column, users need to first add the column to `table_rw` and optionally set its default value for all historical data. Then, after adding the column to `table_pg`, new data can be imported.

Existing materialized views in RisingWave, such as `mv_rw`, and other stream tasks, will not automatically update to reference this newly added column. Users must create new materialized views or stream tasks to reference it. In the future, RisingWave plans to support online query changes for materialized views, giving users the opportunity to avoid rebuilding these stream tasks.

### Dropping a Column

Users can drop the column from `table_rw` and `table_pg` in any order.

If the column is referenced by any materialized view or stream task (e.g., `mv_rw`), requests to drop the column from `table_rw` will be denied. Users need to remove all references to the column in stream tasks before they can drop it from `table_rw`. Another option is to not remove the column from `table_rw`, in which case, all subsequent records will automatically have that column filled with NULL, without affecting the operation of existing materialized views and stream tasks.
