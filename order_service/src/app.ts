import 'dotenv/config'
import express, {type Express} from 'express'
import cors from 'cors';
import router from './routes/routes.js'; 
import helmet from "helmet";

const app:Express = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/', router)

export default app;