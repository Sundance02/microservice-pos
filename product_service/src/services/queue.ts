import amqp from "amqplib"
import DBPrismaService from '../services/dbServices.js'

type EventType = {
    id:number,
    type:string
}

class Queue{
    public async consumeQueue(queueName:string): Promise<EventType|null>{
        const connection = await amqp.connect(`${process.env.QUEUE_URL}`);
        const channel = await connection.createChannel();
        
        await channel.assertQueue(queueName, {durable:true});
        channel.consume(queueName, (msg)=>{
            if(msg !== null){
                const transactionData = JSON.parse(msg.content.toString());
                console.log('queue',transactionData)
                DBPrismaService.manageInventory(transactionData.items)
                channel.ack(msg)

                return transactionData;
            }
        })

        return null;
    }
}

export default new Queue()