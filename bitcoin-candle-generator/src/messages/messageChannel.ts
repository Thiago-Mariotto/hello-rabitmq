import { connect } from 'amqplib';
import { config } from 'dotenv';

config();

export const createMessageChannel = async () => {
	try {
		const connection = await connect(process.env.AMQP_SERVER as string);
		const channel = await connection.createChannel();
		await channel.assertQueue(process.env.QUEUE_NAME as string);
		console.log('Connected to RabbitMQ');

		return channel;
	} catch (error) {
		console.log('Error while trying to connect RabittMq');
		console.log(error);
		return null;
	}
};