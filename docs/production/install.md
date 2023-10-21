---
sidebar_position: 1
---

# Deployment In Production

If you wish to deploy RisingWave in a production environment, we **strongly recommend** deploying it using the Kubernetes mode.

Although deploying RisingWave with Docker Compose can also provide complete functionality, in a production environment, high availability and horizontal scalability are often emphasized. Deployment via Docker Compose cannot meet these requirements.

Of course, if what you need is a single-node version of RisingWave and you understand the risks of machine downtime and insufficient resources, you can still use the Docker Compose method.

As cluster deployment involves more specialized knowledge, readers are advised to refer to the latest official [Kubernetes](https://docs.risingwave.com/docs/current/risingwave-kubernetes/) and [Docker Compose](https://docs.risingwave.com/docs/current/risingwave-trial?method=docker-compose) deployment documentation.
