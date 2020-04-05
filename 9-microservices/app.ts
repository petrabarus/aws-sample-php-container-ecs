import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import { VpcStackProps } from '../lib/shared';
import { Service as Backend1Service } from './backend1/service'
import { Service as Backend2Service } from './backend2/service'
import { Service as FrontendService } from './frontend/service'

class AppStack extends cdk.Stack {
    

    constructor(scope: cdk.Construct, id: string, props: VpcStackProps) {
        super(scope, id, props);
    
        const cluster = new MicroserviceCluster(this, 'MicroserviceCluster', props.vpc);
    
        const backend1 = new Backend1Service(this, 'Backend1Service', {cluster: cluster.cluster});
        const backend2 = new Backend2Service(this, 'Backend2Service', {cluster: cluster.cluster});
        new FrontendService(this, 'FrontendService',
            backend1.loadBalancerUrl,
            backend2.loadBalancerUrl,
            {cluster: cluster.cluster}
        )
    }
}

class MicroserviceCluster extends cdk.Construct {
    public readonly cluster: ecs.Cluster;

    constructor(scope: cdk.Construct, id: string, vpc: ec2.IVpc) {
        super(scope, id);

        this.cluster = new ecs.Cluster(this, 'Cluster', {
            vpc: vpc
        });
        this.cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: new ec2.InstanceType('t2.micro'),
            desiredCapacity: 2,
        });
    }

}

export {AppStack};
