import * as cdk from '@aws-cdk/core'
import './1-php-docker/app1.ts'
import { Stack1 } from './1-php-docker/app1';
import { SharedVpcStack } from './lib/Shared';

const app = new cdk.App();
const vpcStack = new SharedVpcStack(app, 'SharedVpcStack');
new Stack1(app, 'Stack1PHPDocker', {vpc: vpcStack.vpc});
app.synth();