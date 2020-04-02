import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2" 

class SharedVpcStack extends cdk.Stack {
    public readonly vpc: ec2.IVpc;
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.vpc = new ec2.Vpc(this, 'SharedVpc');
    }
}

interface VpcStackProps extends cdk.StackProps {
    vpc: ec2.IVpc;
}

const shortHealthCheck: elbv2.HealthCheck = {
    "interval": cdk.Duration.seconds(5),
    "timeout": cdk.Duration.seconds(4),
    "healthyThresholdCount": 2,
    "unhealthyThresholdCount": 2,
    "healthyHttpCodes": "200,301,302"
}

export {SharedVpcStack, VpcStackProps, shortHealthCheck};