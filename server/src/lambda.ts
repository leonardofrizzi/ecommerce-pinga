import awsServerlessExpress from 'aws-serverless-express'
import { APIGatewayProxyHandler } from 'aws-lambda'
import app from './app'

const server = awsServerlessExpress.createServer(app)

export const handler: APIGatewayProxyHandler = (event, context) =>
  awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise