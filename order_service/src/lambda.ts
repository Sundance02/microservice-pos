import { configure as serverlessExpress } from '@vendia/serverless-express';
import app from '../src/app.js';
export const handler = serverlessExpress({ app });