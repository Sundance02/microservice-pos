import type { SQSHandler, SQSEvent } from 'aws-lambda';
import DBPrismaService from '../src/services/dbServices.js'

export const consumeSQS: SQSHandler = async (event:SQSEvent) => {
    for (const record of event.Records) {
        try {
            const transactionData = JSON.parse(record.body);
            console.log('SQS Message received:', transactionData);

            await DBPrismaService.manageInventory(transactionData.items);

        } catch (error) {
            console.error('Processing event error:', error);
            throw error; 
        }
    }
};