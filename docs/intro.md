---
sidebar_position: 1
---

# Getting Started with RisingWave

Welcome to the RisingWave tutorial! In this guide, you'll learn how to build real-time data processing applications using RisingWave, a powerful distributed SQL streaming database.

:::tip Time to Complete
This tutorial will take about 10 minutes to read. The hands-on exercises will take 15-30 minutes.
:::

## 🎯 What You'll Build

By the end of this tutorial, you'll be able to:

1. Set up a RisingWave instance
2. Create and manage streaming data pipelines
3. Build real-time analytics applications
4. Deploy RisingWave in production

## 🌟 Quick Start Example

Let's start with a simple example to see RisingWave in action. We'll create a real-time counter that updates every second:

```sql
-- Create a source that generates numbers every second
CREATE SOURCE number_source (
    number INTEGER
) WITH (
    connector = 'datagen',
    rows_per_second = '1'
) ROW FORMAT DEEDOO ENCODE JSON;

-- Create a materialized view that counts numbers
CREATE MATERIALIZED VIEW number_counter AS
SELECT COUNT(*) as total_count
FROM number_source;

-- Query the counter
SELECT * FROM number_counter;
```

:::tip Try it yourself!
You can run this example in our [Playground](https://play.risingwave.com) or follow our [Installation Guide](install.md) to set up RisingWave locally.
:::

## 📚 Understanding RisingWave

RisingWave is an event stream processing platform for developers. It offers a unified experience for real-time data ingestion, stream processing, and low-latency serving.

### Core Features

Like other stream processors, RisingWave supports:

- **Ingestion:** Ingest millions of events per second from streaming and batch sources.
- **Stream processing:** Perform real-time incremental processing to join and analyze live data with historical tables.
- **Delivery:** Deliver fresh, consistent results to data lakes (e.g., Apache Iceberg) or any destination.

But RisingWave does more. It provides both **online and offline storage**:

- **Online serving:** Row-based storage for ad-hoc point/range queries with single-digit millisecond latency.
- **Offline persistence:** Apache Iceberg-based storage that persists streaming data at low cost, enabling open access by other query engines.

<img
  src={require('./img/new_archi_grey.png').default}
  alt="RisingWave Architecture"
  style={{maxWidth: '800px', margin: '20px auto'}}
/>

## �� Learning Path

### Getting Started (30 minutes)
1. [Install RisingWave](install.md)
2. [PostgreSQL Quick Start](start/postgres.md)
3. [Kafka Quick Start](start/kafka.md)

### Basic Concepts (1 hour)
1. [Understanding Materialized Views](basics/mv.md)
2. [Data Ingestion](basics/ingestion.md)
3. [Data Sinks](basics/sink.md)
4. [Connectors](basics/connector.md)
5. [Lookup Tables](basics/lookup.md)
6. [Updates](basics/update.md)

### Advanced Features (2 hours)
1. [Window Functions](advanced/window.md)
2. [Complex Joins](advanced/join.md)
3. [Watermarks](advanced/watermark.md)
4. [Schema Evolution](advanced/schema.md)
5. [Temporal Filters](advanced/temporal_filter.md)
6. [Exactly-Once Processing](advanced/eowc.md)

### Production Deployment (1 hour)
1. [Production Installation](production/install.md)
2. [Production FAQ](production/faq.md)

:::tip Pro Tip
Start with the [Installation Guide](install.md) and [PostgreSQL Quick Start](start/postgres.md) to get up and running quickly!
:::

## 🎮 Interactive Examples

### Example 1: Real-Time User Analytics
```sql
-- Track user activity in real-time
CREATE MATERIALIZED VIEW user_activity AS
SELECT 
    user_id,
    COUNT(*) as total_actions,
    MAX(timestamp) as last_active
FROM user_events
GROUP BY user_id;
```

### Example 2: Fraud Detection
```sql
-- Detect suspicious transactions
CREATE MATERIALIZED VIEW fraud_alerts AS
SELECT 
    transaction_id,
    user_id,
    amount,
    timestamp
FROM transactions
WHERE amount > 10000
    OR (SELECT COUNT(*) 
        FROM transactions t2 
        WHERE t2.user_id = transactions.user_id 
        AND t2.timestamp > transactions.timestamp - INTERVAL '1 hour') > 10;
```

## 🛠️ Tools & Ecosystem

RisingWave integrates with popular tools:

- **Data Sources**: Kafka, PostgreSQL, MySQL, and more
- **Data Sinks**: PostgreSQL, MySQL, Redis, and more
- **Monitoring**: Prometheus, Grafana
- **Development**: VS Code, IntelliJ, DBeaver

## 📚 Resources

- 📖 [Official Documentation](https://docs.risingwave.com/)
- 💬 [Community Forum](https://go.risingwave.com/slack)
- 🐛 [Issue Tracker](https://github.com/risingwavelabs/risingwave/issues)


:::tip Pro Tip
Start with the [Installation Guide](install.md) if you're new to stream processing. It will help you understand the basics in just 15 minutes!
:::

## 🔄 Stay Updated

This tutorial is continuously improved. We welcome your feedback and contributions!

:::tip Contributing
Found an issue or have a suggestion? [Open an issue](https://github.com/risingwavelabs/risingwave-tutorials/issues) or submit a pull request!
:::

Ready to begin your RisingWave journey? Let's [install RisingWave](install.md) and start building real-time applications!

