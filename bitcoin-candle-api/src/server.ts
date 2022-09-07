import { config } from 'dotenv';
import { connection } from 'mongoose';
import app from './app';
import { connectMongoDB } from './config/db';

config();
const PORT = process.env.PORT || 3000;

const createServer = async () => {
	await connectMongoDB();
	const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

	process.on('SIGINT', async () => {
		await connection.close();
		console.log('Connection with MongoDB closed');
		server.close();
		console.log('App server connection closed');
	});
}

createServer();