import amqp from "amqplib"
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ region: process.env.AWS_REGION??"ap-southeast-7" });

class Queue {

    public async sendToQueueRabbitMQ(data: any, queueName: string) {
        const connection = await amqp.connect(`${process.env.QUEUE_URL}`);
        const channel = await connection.createChannel();

        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify({ items: data })));

        setTimeout(() => connection.close(), 500);
    }

    public async sendToQueue(data: any, queueUrl: string) {
        const command = new SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify({ items: data }),
        })

        try {
            await sqsClient.send(command)
        } catch (error) {
            console.log('sending events are error', error)
        }
    }

}

export default new Queue();