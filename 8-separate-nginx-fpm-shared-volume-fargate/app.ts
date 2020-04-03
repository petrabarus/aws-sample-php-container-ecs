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
        const taskDefinition = this.createTaskDefinitions();
        const service = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service2', {
            cluster: cluster,
            taskDefinition: taskDefinition,
        });
        service.targetGroup.configureHealthCheck(shortHealthCheck);
    }

    private createTaskDefinitions() {
        const taskDefinition = new ecs.FargateTaskDefinition(this,  'TaskDefinition');
        taskDefinition.addVolume({
            name: 'task',
        })

        this.createNginxContainer(taskDefinition);
        this.createFpmContainer(taskDefinition);
        return taskDefinition;
    }

    private createNginxContainer(taskDef: ecs.FargateTaskDefinition) {
        const container = taskDef.addContainer('nginx', {
            image: ecs.ContainerImage.fromAsset(__dirname + '/docker/nginx'),
            logging: new ecs.AwsLogDriver({ streamPrefix: this.node.id + '_nginx'}),
            memoryLimitMiB: 128,
        });
        container.addPortMappings({containerPort: 80});
        container.addMountPoints({
            sourceVolume: 'task',
            containerPath: '/tmp/assets',
            readOnly: false,
        });
        return container;
    }

    private createFpmContainer(taskDef: ecs.FargateTaskDefinition) {
        const container = taskDef.addContainer('fpm', {
            image: ecs.ContainerImage.fromAsset(__dirname),
            logging: new ecs.AwsLogDriver({ streamPrefix: this.node.id + '_fpm'}),
            memoryLimitMiB: 128,
        });

        container.addPortMappings({containerPort:9000});
        container.addMountPoints({
            sourceVolume: 'task',
            containerPath: '/tmp/assets',
            readOnly: false,
        });

        return container;
    }
}
