import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import { VpcStackProps } from '../lib/shared';
import { ServiceStack as Backend1ServiceStack } from './backend1/service'
import { ServiceStack as Backend2ServiceStack } from './backend2/service'
import { ServiceStack as FrontendServiceStack } from './frontend/service'

class ClusterStack extends cdk.Stack {
    public readonly cluster: ecs.Cluster;

    constructor(scope: cdk.Construct, id: string, props: VpcStackProps) {
        super(scope, id, props);
    
        this.cluster = this.createCluster(props.vpc);
    }

    private createCluster(vpc: ec2.IVpc): ecs.Cluster {
        const cluster = new ecs.Cluster(this, 'Cluster', {
            vpc: vpc
        });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
            desiredCapacity: 2,
        });
        return cluster;
    }
}

export {ClusterStack, Backend1ServiceStack, Backend2ServiceStack, FrontendServiceStack};
