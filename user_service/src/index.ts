import 'dotenv/config';
import express from "express";
import cors from 'cors';
import helmet from "helmet";
import router from './routes/routes.js';
const app = express();
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use('/', router)

app.listen(process.env.PORT, async ()  =>{
    console.log('User service running at', process.env.PORT)
})