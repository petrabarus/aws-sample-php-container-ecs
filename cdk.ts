import * as cdk from '@aws-cdk/core'
import './1-php-docker/app1.ts'
import { Stack1 } from './1-php-docker/app1';
import { Stack2 } from './2-php-separate-nginx-fpm-docker/app2';
import { SharedVpcStack } from './lib/shared';

const app = new cdk.App();
const vpcStack = new SharedVpcStack(app, 'SharedVpcStack');
new Stack1(app, 'Stack1PHPDocker', {vpc: vpcStack.vpc});
new Stack2(app, 'Stack2PHPFPMSeparateContainer', {vpc: vpcStack.vpc});
app.synth();