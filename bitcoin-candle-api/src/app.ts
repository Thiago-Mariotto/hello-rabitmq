import * as cors from 'cors';
import * as express from 'express';
import * as logger from 'morgan';

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

export default app;