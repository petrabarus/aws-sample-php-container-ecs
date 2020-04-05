import * as cdk from '@aws-cdk/core'
import { SharedVpcStack } from './lib/shared';
import { AppStack as App1Stack } from './1-php-docker/app';
import { AppStack as App2Stack } from './2-php-separate-nginx-fpm-docker/app';
import { AppStack as App3Stack } from './3-separate-nginx-fpm-shared-volume/app';
import { AppStack as App4Stack } from './4-multiple-task-local-session/app';
import { AppStack as App5Stack } from './5-multiple-task-dynamodb-session/app';
import { AppStack as App6Stack } from './6-php-docker-fargate/app'
import { AppStack as App7Stack } from './7-php-separate-nginx-fpm-fargate/app';
import { AppStack as App8Stack } from './8-separate-nginx-fpm-shared-volume-fargate/app';
import { AppStack as App9Stack } from './9-microservices/app';

const app = new cdk.App();
const vpcStack = new SharedVpcStack(app, 'SharedVpcStack');
const vpc = vpcStack.vpc;
new App1Stack(app, 'App1Stack', {vpc: vpc});
new App2Stack(app, 'App2Stack', {vpc: vpc});
new App3Stack(app, 'App3Stack', {vpc: vpc});
new App4Stack(app, 'App4Stack', {vpc: vpc});
new App5Stack(app, 'App5Stack', {vpc: vpc});
new App6Stack(app, 'App6Stack', {vpc: vpc});
new App7Stack(app, 'App7Stack', {vpc: vpc});
new App8Stack(app, 'App8Stack', {vpc: vpc});
new App9Stack(app, 'App9Stack', {vpc: vpc});

app.synth();
