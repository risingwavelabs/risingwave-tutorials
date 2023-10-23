---
sidebar_position: 2
---

# Quick Install

## Installation Mode

RisingWave has the following installation modes:

- **Single-node Playground Mode ([Official Doc](https://docs.risingwave.com/docs/current/risingwave-trial/?method=overview))**: If you just want to learn how to use RisingWave, then the single-node playground mode should meet basic needs. However, this mode does not support some complex features, such as Change Data Capture (CDC), etc.;

- **Single-node Docker Deployment Mode ([Official Doc](https://docs.risingwave.com/docs/current/risingwave-trial/?method=docker-compose))**: Single-node Docker deployment mode is feature-rich, but if you plan to use it in a production environment, think twice. After all, if the physical machine crashes, it will directly lead to system unavailability or data loss;

- **Kubernetes Cluster Deployment Mode ([Official Doc](https://docs.risingwave.com/docs/dev/risingwave-kubernetes/))**: Kubernetes cluster deployment mode is the most recommended deployment mode for production environments.

:::tip RisingWave Cloud

Not everyone is willing to install systems locally. If you prefer not to install, that's fine, you can also use the **free tier** of [RisingWave Cloud](https://cloud.risingwave.com/) directly. This is the most convenient way to use RisingWave without installation, and it takes only **5 minutes** to get a feature-rich cluster ready.
:::


|  | Time | Feature Set | Production Use? |
| :: | :: | :: | :: |
|  [Single-node playground](https://docs.risingwave.com/docs/current/risingwave-trial/?method=overview)   |  5 minutes      | Limited features | No |
|  [Single-node Docker deployment](https://docs.risingwave.com/docs/current/risingwave-trial/?method=docker-compose)  | 10-20 minutes        | Feature-rich | Yes, but think twice |
|  [Kubernetes Cluster Deployment](https://docs.risingwave.com/docs/dev/risingwave-kubernetes/)  | May vary        | Feature-rich | Yes (recommended) |
|  [RisingWave Cloud](https://cloud.risingwave.com/)  | 5 minutes        | Feature-rich | Yes (recommended) |

## Install Playground

Since the purpose of this tutorial is to let everyone understand and use RisingWave, we choose the **single-node playground mode**. Note that this mode operates purely in memory and will automatically stop after being idle for 30 minutes.

The operating system used in this article is **Ubuntu 20.04.6 LTS**. The version of RisingWave to be installed is **1.2.0**. The entire installation process takes up to **5 minutes**.

### Download
```shell
wget https://github.com/risingwavelabs/risingwave/releases/download/v1.2.0/risingwave-v1.2.0-x86_64-unknown-linux.tar.gz
tar xvf risingwave-v1.2.0-x86_64-unknown-linux.tar.gz
```

### Start service
```shell
./risingwave playground
```
Now, RisingWave has started running.

### Connect via `psql`
```shell
psql -h localhost -p 4566 -d dev -U root
```

`psql` is the official command-line client for PostgreSQL. The following command can be used for installation:

```shell
sudo apt update
sudo apt install postgresql-client
```

### Verification
We create a table and a materialized view to see if RisingWave is running normally.

```sql
create table t(v1 int, v2 int);
insert into t values(1,10),(2,20),(3,30);
create materialized view mv as select sum(v1) from t;
```

Then we query the created materialized view:

```sql
select * from mv;
```

We should see:
```sql
 sum
-----
   6
(1 row)
```

Then we insert two rows of data:
```sql
insert into t values(4,40),(5,50);
```

Then query the materialized view:
```sql
select * from mv;
```

The result should have already been updated:
```sql
 sum
-----
  15
(1 row)
```

The above is the simplest program to verify whether RisingWave can run correctly. Users should always be able to see the latest results with consistency guarantees in the materialized view.