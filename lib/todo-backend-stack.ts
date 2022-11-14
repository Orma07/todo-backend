import * as cdk from 'aws-cdk-lib';
import {AttributeType, BillingMode, Table} from "aws-cdk-lib/aws-dynamodb";
import {RemovalPolicy} from "aws-cdk-lib";
import { join } from 'path';
import {Construct} from "constructs";
import {NodejsFunction, NodejsFunctionProps} from "aws-cdk-lib/aws-lambda-nodejs";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import {IResource, LambdaIntegration, MockIntegration, PassthroughBehavior, RestApi} from "aws-cdk-lib/aws-apigateway";

export class TodoBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoTable = new Table(this, 'todos-table', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: 'todo-backend',
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk',
        ],
      },
      depsLockFilePath: join(__dirname, 'lambda', 'package-lock.json'),
      environment: {
        TODO_TABLE_NAME: dynamoTable.tableName
      },
      runtime: Runtime.NODEJS_14_X,
    };

    // Create a Lambda function for each of the CRUD operations
    const createOneLambda = new NodejsFunction(this, 'put', {
      entry: join(__dirname, 'lambda', 'index.ts'),
      handler: 'put',
      ...nodeJsFunctionProps,
    });
    const getAllLambda = new NodejsFunction(this, 'get-all', {
      entry: join(__dirname, 'lambda', 'index.ts'),
      handler: 'getAll',
      ...nodeJsFunctionProps,
    });
    const updateOneLambda = new NodejsFunction(this, 'update', {
      entry: join(__dirname, 'lambda', 'index.ts'),
      handler: 'update',
      ...nodeJsFunctionProps,
    });
    const deleteOneLambda = new NodejsFunction(this, 'delete-by-id', {
      entry: join(__dirname, 'lambda', 'index.ts'),
      handler: 'deleteById',
      ...nodeJsFunctionProps,
    });

    // Grant the Lambda function read access to the DynamoDB table
    dynamoTable.grantReadWriteData(getAllLambda);
    dynamoTable.grantReadWriteData(createOneLambda);
    dynamoTable.grantReadWriteData(updateOneLambda);
    dynamoTable.grantReadWriteData(deleteOneLambda);

    /// Integrate the Lambda functions with the API Gateway resource
    const getAllIntegration = new LambdaIntegration(getAllLambda);
    const createOneIntegration = new LambdaIntegration(createOneLambda);
    const updateOneIntegration = new LambdaIntegration(updateOneLambda);
    const deleteOneIntegration = new LambdaIntegration(deleteOneLambda);


    // Create an API Gateway resource for each of the CRUD operations
    const api = new RestApi(this, 'todo-api', {
      restApiName: 'Todo Service'
    });

    const todos = api.root.addResource('todo');
    todos.addMethod('GET', getAllIntegration);
    todos.addMethod('POST', createOneIntegration);
    todos.addMethod('PATCH', updateOneIntegration);
    addCorsOptions(todos);

    const byId = todos.addResource('{id}');
    byId.addMethod('DELETE', deleteOneIntegration);
    addCorsOptions(byId);
  }

}

export function addCorsOptions(apiResource: IResource) {
  apiResource.addMethod('OPTIONS', new MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
      },
    }],
    passthroughBehavior: PassthroughBehavior.NEVER,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
  }), {
    methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Credentials': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },
    }]
  })
}