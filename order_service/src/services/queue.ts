import amqp from "amqplib"

class Queue {

    public async sendToQueue(data:any, queueName:string) {
        const connection = await amqp.connect(`${process.env.QUEUE_URL}`);
        const channel = await connection.createChannel();

        await channel.assertQueue(queueName, {durable:true});
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify({items:data})));

        setTimeout(()=> connection.close(), 500);
    }

}

export default new Queue();