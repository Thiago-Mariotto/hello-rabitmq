import axios from 'axios';
import { config } from 'dotenv';
import Period from './enums/Period';
import { createMessageChannel } from './messages/messageChannel';
import Candle from './models/Candle';

config();

const readMarketPrice = async (): Promise<number> => {
	const { data } = await axios.get(process.env.API_COIN_URL as string);
	const price = data.bitcoin.usd;
	return price;
};

const generateCandles = async () => {

	const messageChannel = await createMessageChannel();
	if (messageChannel) {
		while (true) {
			const loopTimes = Period.FIVE_MINUTES / Period.TEN_SECONDS;
			const candle = new Candle('BTC', new Date());

			console.log('\n######################################\n');
			console.log(`Generate new candle`);

			for (let i = 0; i < loopTimes; i++) {
				const price = await readMarketPrice();
				candle.addValue(price);
				console.log(`\nMarket price #${i + 1} of ${loopTimes}`);

				await new Promise(r => setTimeout(r, Period.TEN_SECONDS));
			};

			candle.closeCandle();
			console.log('Candle Finaly');
			const candleObject = candle.toSimpleObject();
			const candleJson = JSON.stringify(candleObject);
			messageChannel.sendToQueue(process.env.QUEUE_NAME as string, Buffer.from(candleJson));
		};
	};
};

generateCandles();