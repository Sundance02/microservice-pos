import 'dotenv/config'
import express from 'express'
import cors from 'cors';
import router from './routes/routes.js'; 
import helmet from "helmet";

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/', router)
app.listen(process.env.PORT, async () =>{
    console.log('Order Service running at', process.env.PORT);
})
