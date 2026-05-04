import { configure as serverlessExpress } from '@vendia/serverless-express';
import app from '../src/app.js';
import {consumeSQS} from "../src/handler.js"
export const handler = serverlessExpress({ app });
export const sqsHandler = consumeSQS;