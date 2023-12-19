---
sidebar_position: 3
---
# Install Kafka (via WarpStream)

WarpStream is an Apache Kafka-compatible data streaming platform built directly on top of S3.

Follow the following easy steps to get started with Warpstrean Kafka:

1. You need to install WarpStream Agent / CLI to interact with the WarpStream cluster:

```shell
curl https://console.warpstream.com/install.sh | bash
```


2. After installing WarpStream agent, run the following command in the terminal:
```shell  
warpstream playground
```
Now, create a Kafka topic, produce and read records from the WarpStream Kafka cluster using WarpStream agent as:

```shell 
warpstream kcmd --type create-topic --topic helloworld
```
```shell 
warpstream kcmd --type produce --topic helloworld --records "world,,world"
```
```shell 
warpstream kcmd --type fetch --topic helloworld --offset 0
```
With these steps, you are on your way to leveraging the capabilities of WarpStream Kafka. 
For detailed documentation and client-specific guides, please refer to [WarpStream documentation](https://docs.warpstream.com/warpstream/).

# Connect RisingWave to WarpStream

To make things simple and easy, you can use [RisingWave Cloud](https://cloud.risingwave.com/) free-tier account to set up a RisingWave cluster. RisingWave Cloud helps manage the cluster and provides useful features such as a web SQL editor, data pipeline visualizer, GUI for source/sink management, database user management, and metrics dashboards.

For this tutorial, you can run the command `warpstream demo` to create a Kafka topic and populate it with the data that can be consumed by RisingWave. 

After successfully creating a RisingWave cluster, let us create a source named `website_visits` to ingest data from WarpStream into RisingWave cluster:

```sql
CREATE SOURCE IF NOT EXISTS website_visits_stream (
 timestamp timestamp,
 user_id varchar,
 page_id varchar,
 action varchar
 )
WITH (
 connector='kafka',
 topic='demo-stream',
 properties.bootstrap.server='localhost:9092',
 scan.startup.mode='earliest'
 ) ROW FORMAT JSON;
```

Now, create a materialized view in RisingWave:

```sql
CREATE MATERIALIZED VIEW visits_stream_mv AS 
SELECT page_id, 
count(*) AS total_visits, 
count(DISTINCT user_id) AS unique_visitors, 
max(timestamp) AS last_visit_time 
FROM website_visits_stream 
GROUP BY page_id;
```

After creating a materialized view, query it:

```sql
SELECT * FROM visits_stream_mv;
```

Below is the result you may see:

```sql

 page_id | total_visits | unique_visitors |   last_visit_time   
---------+--------------+-----------------+---------------------
 page_0  |            2 |               2 | 2023-07-26 19:03:08
 page_4  |            9 |               9 | 2023-07-26 19:03:00
 page_8  |            9 |               9 | 2023-07-26 19:02:57
 page_3  |           14 |              14 | 2023-07-26 19:03:09
 page_7  |            4 |               4 | 2023-07-26 19:02:52
 page_1  |            7 |               6 | 2023-07-26 19:02:55
 page_5  |            9 |               9 | 2023-07-26 19:03:01
 page_9  |           12 |              12 | 2023-07-26 19:02:48
 page_2  |            4 |               4 | 2023-07-26 19:02:58
 page_6  |            7 |               6 | 2023-07-26 19:03:03
```

Now you have successfully ingested data from WarpStream into RisingWave, created a materialized view, and then queried the materialized view in RisingWave.

For more detailed information about the integration of RisingWave with WarpStream, please refer to the [Instructions on how to use WarpStream with RisingWave](https://docs.warpstream.com/warpstream/how-to/integrations/use-warpstream-with-risingwave) in the WarpStream's documentation.
