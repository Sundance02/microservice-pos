import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes/routes.js'; 
import helmet from "helmet";
import Queue from "./services/queue.js"

const app = express();
app.use(express.json());
app.use(cors());

app.use(helmet())

app.use("/", router)

app.listen(process.env.PORT, async () => {
    console.log('Product Service running at', process.env.PORT);
    try {
        await Queue.consumeQueue('Paid')
    } catch (error) {
        console.log('fail to connect Queue consumer', error)
    }
});