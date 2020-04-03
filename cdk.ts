import * as cdk from '@aws-cdk/core'
import { SharedVpcStack } from './lib/shared';
import { AppStack as Stack1 } from './1-php-docker/app';
import { AppStack as Stack2 } from './2-php-separate-nginx-fpm-docker/app';
import { AppStack as Stack3 } from './3-separate-nginx-fpm-shared-volume/app';
import { AppStack as Stack4 } from './4-multiple-task-local-session/app';
import { AppStack as Stack5 } from './5-multiple-task-dynamodb-session/app';
import { AppStack as Stack6 } from './6-php-docker-fargate/app'
import { AppStack as Stack7 } from './7-php-separate-nginx-fpm-fargate/app';
import { AppStack as Stack8 } from './8-separate-nginx-fpm-shared-volume-fargate/app';
import * as microservice from './9-microservices/cluster';

const app = new cdk.App();
const vpcStack = new SharedVpcStack(app, 'SharedVpcStack');
const vpc = vpcStack.vpc;
new Stack1(app, 'App1Stack', {vpc: vpc});
new Stack2(app, 'App2Stack', {vpc: vpc});
new Stack3(app, 'App3Stack', {vpc: vpc});
new Stack4(app, 'App4Stack', {vpc: vpc});
new Stack5(app, 'App5Stack', {vpc: vpc});
new Stack6(app, 'App6Stack', {vpc: vpc});
new Stack7(app, 'App7Stack', {vpc: vpc});
new Stack8(app, 'App8Stack', {vpc: vpc});

//Simple microservice example
const cluster = new microservice.ClusterStack(app, 'App9ClusterStack', {vpc: vpc});
const backend1Stack = new microservice.Backend1ServiceStack(app, 'App9Backend1Stack', {cluster: cluster.cluster});
const backend2Stack = new microservice.Backend2ServiceStack(app, 'App9Backend2Stack', {cluster: cluster.cluster});
new microservice.FrontendServiceStack(app, 'App9FrontendStack', 
    backend1Stack.loadBalancerUrl,
    backend2Stack.loadBalancerUrl, 
    {cluster: cluster.cluster});
// cdk deploy App9ClusterStack App9Backend1Stack App9Backend2Stack App9FrontendStack

//TODO: Service discovery
app.synth();
