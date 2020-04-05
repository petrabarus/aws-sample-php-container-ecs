import * as cdk from '@aws-cdk/core';
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import { MicroserviceProps, shortHealthCheck } from '../../lib/shared';

export class Service extends cdk.Construct {
    constructor(
        scope: cdk.Construct,
        id: string,
        backend1Url: string,
        backend2Url: string,
        props: MicroserviceProps) {
        super(scope, id);
        this.createService(props.cluster, backend1Url, backend2Url);
    }

    private createService(
        cluster: ecs.Cluster,
        backend1Url: string,
        backend2Url: string
        ) {
        const service = new ecsPatterns.ApplicationLoadBalancedEc2Service(this, 'Service1', {
            cluster: cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromAsset(__dirname),
                environment: {
                    BACKEND1_URL: backend1Url,
                    BACKEND2_URL: backend2Url,
                }
            },
            desiredCount: 3,
            memoryLimitMiB: 128
        });
        service.targetGroup.configureHealthCheck(shortHealthCheck);
    }
}
