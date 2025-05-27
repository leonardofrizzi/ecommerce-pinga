import awsServerlessExpress from 'aws-serverless-express';
import app from './app';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createServer } from 'http';

const server = awsServerlessExpress.createServer(app);

export const handler: APIGatewayProxyHandler = (event, context) => {
  return awsServerlessExpress.proxy(server, event, context);
};
