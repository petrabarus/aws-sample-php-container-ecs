import * as cdk from '@aws-cdk/core'
import './1-php-docker/app.ts'
import { SharedVpcStack } from './lib/shared';
import { AppStack as Stack1 } from './1-php-docker/app';
import { AppStack as Stack2 } from './2-php-separate-nginx-fpm-docker/app';
import { AppStack as Stack3 } from './3-separate-nginx-fpm-shared-volume/app';
import { AppStack as Stack4 } from './4-multiple-task-local-session/app';
import { AppStack as Stack5 } from './5-multiple-task-dynamodb-session/app';
import { AppStack as Stack6 } from './6-php-docker-fargate/app'
import { AppStack as Stack7 } from './7-php-separate-nginx-fpm-fargate/app';
import { AppStack as Stack8 } from './8-separate-nginx-fpm-shared-volume-fargate/app'

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

app.synth();
