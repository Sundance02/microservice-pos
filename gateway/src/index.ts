import 'dotenv/config';
import expres from 'express';
import morgan from 'morgan'; 
import helmet from "helmet";
import router from './routes/routes.js';
const app = expres()
app.use(morgan('dev'))
app.use(helmet())

app.use('/', router)

app.listen(process.env.PORT, async () =>{
    console.log('API GATEWAY running at', process.env.PORT)
})