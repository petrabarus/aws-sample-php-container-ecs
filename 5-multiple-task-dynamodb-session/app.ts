import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';

import { VpcStackProps, shortHealthCheck } from '../lib/shared';


export class AppStack extends cdk.Stack {
    private cluster: ecs.Cluster;
    
    private sessionsTable: dynamodb.Table;

    constructor(scope: cdk.Construct, id: string, props: VpcStackProps) {
        super(scope, id, props);
    
        this.cluster = this.createCluster(props.vpc);
        this.sessionsTable = this.createSessionsTable();
        this.createService(this.cluster, this.sessionsTable);
    }

    private createSessionsTable(): dynamodb.Table {
        const table = new dynamodb.Table(this, 'Sessions', {
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING,
            }
        });
        return table;
    }

    private createCluster(vpc: ec2.IVpc): ecs.Cluster {
        const cluster = new ecs.Cluster(this, 'Cluster', {
            vpc: vpc
        });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro')
        });
        return cluster;
    }

    private createService(cluster: ecs.Cluster, sessionsTable: dynamodb.Table) {
        const region = cdk.Stack.of(this).region;
        const service = new ecsPatterns.ApplicationLoadBalancedEc2Service(this, 'Service1', {
            cluster: cluster,
            desiredCount: 5,
            taskImageOptions: {
                image: ecs.ContainerImage.fromAsset(__dirname),
                environment: {
                    AWS_REGION: region,
                    DYNAMODB_SESSION_TABLE_NAME: sessionsTable.tableName,
                }
            },
            memoryLimitMiB: 128,
        });
        service.targetGroup.configureHealthCheck(shortHealthCheck);

        this.grantPermissions(sessionsTable, service.taskDefinition.taskRole);
        return service;
    }

    private grantPermissions(sessionsTable: dynamodb.Table, role: iam.IGrantable) {
        const actions = [
            "dynamodb:GetItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
            "dynamodb:Scan",
            "dynamodb:BatchWriteItem"
        ]
        sessionsTable.grant(role, ...actions);
    }
}
