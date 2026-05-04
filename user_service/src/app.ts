import 'dotenv/config';
import express, {type Express} from "express";
import cors from 'cors';
import helmet from "helmet";
import router from './routes/routes.js';
const app:Express = express();
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use('/', router)

export default app;