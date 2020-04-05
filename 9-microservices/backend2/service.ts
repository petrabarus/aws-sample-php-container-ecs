import * as cdk from '@aws-cdk/core';
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import { MicroserviceProps, shortHealthCheck } from '../../lib/shared';

export class Service extends cdk.Construct {
    public readonly loadBalancerUrl: string;
    
    constructor(scope: cdk.Construct, id: string, props: MicroserviceProps) {
        super(scope, id);
        const service = this.createService(props.cluster);

        this.loadBalancerUrl = service.loadBalancer.loadBalancerDnsName;
    }

    private createService(cluster: ecs.Cluster): ecsPatterns.ApplicationLoadBalancedEc2Service {
        const service = new ecsPatterns.ApplicationLoadBalancedEc2Service(this, 'Service1', {
            cluster: cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromAsset(__dirname),
            },
            desiredCount: 3,
            memoryLimitMiB: 128,
            publicLoadBalancer: false,
        });
        service.targetGroup.configureHealthCheck(shortHealthCheck);

        return service;
    }
}
