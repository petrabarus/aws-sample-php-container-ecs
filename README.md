# Demo Containerized PHP Application using Amazon ECS (with AWS CDK)

This is demo from my presentation **"Containerized PHP Application On Amazon Elastic Container Service"**

## Requirements

To use this demo, you have to install

- Docker
- Docker Compose
- AWS CDK

## Runnning Demo

To run the demo locally, execute

```
docker-compose up
```

And access `http://localhost:8080`.

To run the demo, first you need to see the list of stacks available.

```
cdk ls
```

Then you run the stack using 

```
cdk deploy <Stack Name>
```