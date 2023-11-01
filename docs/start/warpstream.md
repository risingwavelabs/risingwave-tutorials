---
sidebar_position: 3
---
# Warpstream Kafka Quick Start

Follow these four easy steps to get started with Upstash Kafka.

## 1. Sign Up for an Warpstream Cloud Account

Start by signing up for a free Upstash Cloud account, which will grant you access to our Kafka services. To create your account, visit [Warpstream Cloud Account](https://console.warpstream.com/signup).

## 2. Create a Kafka Cluster

Once you are logged in, create your Kafka cluster with the following details:

- **Cluster Name**: Give your Kafka cluster a unique name for identification.

## 3. Set Up a Kafka Topic

After creating your cluster, set up a Kafka topic effortlessly. Warpstream Kafka provides default configurations for the number of partitions and retention policy, simplifying the setup process.

## 4. Connect and Interact with Your Kafka Cluster

1. You need to install Warpstream Agent / CLI to interact with the cluster:

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
With these steps, you are on your way to leveraging the capabilities of Warpstream Kafka. Explore the full potential of event streaming for your applications both using RisingWave and Warpstream!

For detailed documentation and client-specific guides, please refer to our [WarpstreamKafka Documentation](https://docs.warpstream.com/warpstream/).

