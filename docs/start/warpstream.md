---
sidebar_position: 3
---
# Install Kafka (via Warpstream)
WarpStream is an Apache Kafka compatible data streaming platform built directly on top of S3.

Follow the following easy steps to get started with Warpstrean Kafka:
1. You need to install Warpstream Agent / CLI to interact with the Warpstream cluster:

```shell
curl https://console.warpstream.com/install.sh | bash
```


2. After installing Warpstream agent, run the following command in the terminal:
```shell  
warpstream playground
```
Now, create a kafka topic, produce and read records from the Warpstream Kafka cluster using Warpstream agent as:

```shell 
warpstream kcmd --type create-topic --topic helloworld
```
```shell 
warpstream kcmd --type produce --topic helloworld --records "world,,world"
```
```shell 
warpstream kcmd --type fetch --topic helloworld --offset 0
```
With these steps, you are on your way to leveraging the capabilities of Warpstream Kafka. 
For detailed documentation and client-specific guides, please refer to [WarpstreamKafka Documentation](https://docs.warpstream.com/warpstream/).

# Connect RisingWave to Warpstream
To make things simple and easy, you use [RisingWave Cloud](https://cloud.risingwave.com/) free-tier account to set up a RisingWave cluster. RisingWave Cloud helps manage the cluster and provides useful features such as a web SQL editor, data pipeline visualizer, GUI for source/sink management, database user management, and metrics dashboards.

For this tutorial, you run the command `warpstream demo` to create a Kafka topic and populate it with the data that can be consumed by the RisingWave. 

After successfully creating a RisingWave cluster, you create a source named `website_visits` to ingest data from Warpstream into RisingWave cluster:
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
Now, you create a materialized view in RisingWave:
```sql
CREATE MATERIALIZED VIEW visits_stream_mv AS 
SELECT page_id, 
count(*) AS total_visits, 
count(DISTINCT user_id) AS unique_visitors, 
max(timestamp) AS last_visit_time 
FROM website_visits_stream 
GROUP BY page_id;
```
After creating a materialized view, now you query it:
```sql
select * FROM visits_stream_mv;
```
This shows the following result:
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
Congratulations, you successfully ingested data from Warpstream into RisingWave, created a materialized view and then, queried the materialized view in RisingWave.

For more detailed information about the integration of RisingWave with Warpstream, please refer to [Warpstream documentation](https://docs.warpstream.com/warpstream/how-to/integrations/use-warpstream-with-risingwave).
