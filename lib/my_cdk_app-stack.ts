import * as cdk from 'aws-cdk-lib';
// import * as cdk from '@aws-cdk/core';
import * as amplify from 'aws-cdk-lib/aws-amplify';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
// import { Construct } from 'constructs';

// import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';

export class MyInfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Amplify App
    const amplifyApp = new amplify.CfnApp(this, 'MyAmplifyApp', {
      name: 'amplifytestapptask2',
    });

    // S3 Bucket
    const s3Bucket = new s3.Bucket(this, 'MyS3Bucket', {
      bucketName: amplifyApp.name, // Use Amplify project name as S3 bucket name
    });

    // Lambda Function
    const lambdaFunction = new lambda.Function(this, 'MyLambdaFunction', {
      functionName: 'MyLambdaFunction',
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'), // Change this to your actual Lambda code path
      environment: {
        S3_BUCKET_NAME: amplifyApp.name,
      },
    });

    // Grant Lambda permissions to access S3 bucket
    s3Bucket.grantReadWrite(lambdaFunction);

    // Set up Lambda function to trigger on S3 object creation
    const eventRule = new events.Rule(this, 'MyS3EventRule', {
      eventPattern: {
        source: ['aws.s3'],
        detail: {
          eventName: ['PutObject'],
        },
        resources: [s3Bucket.bucketArn],
      },
    });

    eventRule.addTarget(new targets.LambdaFunction(lambdaFunction));

    // Output Amplify App URL
    // new cdk.CfnOutput(this, 'WebsiteURL', {
    //   value: amplify.app|| 'NoAppURLAvailable',
    //   description: 'URL of the Amplify-hosted website',
    // });
  }
}

const app = new cdk.App();
new MyInfrastructureStack(app, 'MyInfrastructureStack');
