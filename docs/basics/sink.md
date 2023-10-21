---
sidebar_position: 5
---

# Data Delivery

Some users wish to use RisingWave for stream processing and then deliver the computed results to downstream systems. This is a common stream ETL scenario.
In RisingWave, users can directly use the [`create sink` statement](https://docs.risingwave.com/docs/current/sql-create-sink/) to achieve data delivery.