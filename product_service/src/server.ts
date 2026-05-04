import 'dotenv/config';
import Queue from "./services/queue.js"
import app from "./app.js"

app.listen(process.env.PORT, async () => {
    console.log('Product Service running at', process.env.PORT);
    try {
        await Queue.consumeQueue('Paid')
    } catch (error) {
        console.log('fail to connect Queue consumer', error)
    }
});