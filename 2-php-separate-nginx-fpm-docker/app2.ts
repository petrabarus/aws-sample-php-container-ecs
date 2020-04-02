import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import { VpcStackProps, shortHealthCheck } from '../lib/shared';

export class Stack2 extends cdk.Stack {
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
            instanceType: new ec2.InstanceType('t2.micro')
        });
        return cluster;
    }

    private createService(cluster: ecs.Cluster) {
        const taskDefinition = this.createTaskDefinitions();
        const service = new ecsPatterns.ApplicationLoadBalancedEc2Service(this, 'Service2', {
            cluster: cluster,
            taskDefinition: taskDefinition,
        });
        service.targetGroup.configureHealthCheck(shortHealthCheck);
    }

    private createTaskDefinitions() {
        const taskDefinition = new ecs.Ec2TaskDefinition(this,  'TaskDefinition', {
            networkMode: ecs.NetworkMode.BRIDGE,
        });

        const nginxContainer = taskDefinition.addContainer('nginx', {
            image: ecs.ContainerImage.fromAsset(__dirname + '/docker/nginx'),
            logging: new ecs.AwsLogDriver({ streamPrefix: this.node.id + '_nginx'}),
            memoryLimitMiB: 128,
        });
        nginxContainer.addPortMappings({containerPort: 80});
        const fpmContainer = taskDefinition.addContainer('fpm', {
            image: ecs.ContainerImage.fromAsset(__dirname),
            logging: new ecs.AwsLogDriver({ streamPrefix: this.node.id + '_fpm'}),
            memoryLimitMiB: 128,
        });
        fpmContainer.addPortMappings({containerPort:9000});

        nginxContainer.addLink(fpmContainer);
        return taskDefinition;
    }
}
