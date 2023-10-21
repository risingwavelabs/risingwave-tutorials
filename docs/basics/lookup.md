---
sidebar_position: 3
---

# Ad-hoc Queries and Visualization

Like traditional databases, RisingWave can store data and allow users to perform ad-hoc queries on it. However, it's important to note that the _source_ in RisingWave does not persist data, and therefore cannot be directly queried ad-hoc by users. The main reason relates to data ownership, data consistency, and performance issues. Interested readers can refer to the discussion in [previous article](../basics/ingestion).

| Functions | Tables | Sources | Materialized Views |
| :: | :: | :: | :: |
| Support ad-hoc queries<br />(`select` statement)    | yes       | **no** | yes|
| Support streaming queries<br />(`create materialized view` statement)   | yes        | yes | yes|


In production environments, RisingWave is widely used for real-time reporting. Users can utilize a variety of reporting tools, such as [Apache Superset](https://docs.risingwave.com/docs/current/superset-integration/), [Grafana](https://docs.risingwave.com/docs/current/grafana-integration/), etc., to interface with RisingWave.

If the reporting tool you are using is not listed in the official RisingWave documentation, you can also attempt to connect to RisingWave directly using the PostgreSQL interface. This is due to RisingWave being compatible with the PostgreSQL wire protocol, hence, most systems within the PostgreSQL ecosystem are likely able to communicate with RisingWave directly.