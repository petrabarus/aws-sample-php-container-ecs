import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import { VpcStackProps, shortHealthCheck } from '../lib/shared';

export class Stack1 extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: VpcStackProps) {
        super(scope, id, props);
    
        const cluster = this.createCluster(props.vpc);
        this.createService(cluster);
    }

    private createCluster(vpc: ec2.IVpc): ecs.Cluster {
        const cluster = new ecs.Cluster(this, 'Cluster', {
            vpc: vpc
        });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.small')
        })
        return cluster;
    }

    private createService(cluster: ecs.Cluster) {
        const service = new ecsPatterns.ApplicationLoadBalancedEc2Service(this, 'Service1', {
            cluster: cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromAsset(__dirname),
            },
            memoryLimitMiB: 128
        });
        service.targetGroup.configureHealthCheck(shortHealthCheck);
    }
}
