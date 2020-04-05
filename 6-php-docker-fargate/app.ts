import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import { VpcStackProps, shortHealthCheck } from '../lib/shared';

export class AppStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: VpcStackProps) {
        super(scope, id, props);
    
        const cluster = this.createCluster(props.vpc);
        this.createService(cluster);
    }

    private createCluster(vpc: ec2.IVpc): ecs.Cluster {
        const cluster = new ecs.Cluster(this, 'Cluster', {
            vpc: vpc
        });
        return cluster;
    }

    private createService(cluster: ecs.Cluster) {
        const service = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service1', {
            cluster: cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromAsset(__dirname),
            },
            desiredCount: 3,
        });
        service.targetGroup.configureHealthCheck(shortHealthCheck);
    }
}
