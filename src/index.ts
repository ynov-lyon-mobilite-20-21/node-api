/* eslint-disable @typescript-eslint/no-var-requires */
import mongoose from 'mongoose';
import express, { Application, json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import morganBody from 'morgan-body';

import RefreshTokenCron from './crons/refresh-token-cron';

const app: Application = express();

if (process.env.NODE_ENV === undefined) {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const { NODE_ENV, DB_URL, PORT } = process.env;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion,max-len
mongoose.connect(DB_URL!, {
  useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false,
})
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB');
    RefreshTokenCron.start();
  })
// eslint-disable-next-line no-console
  .catch((err: Error) => console.log(err));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const router = require('./router').default;

app.use(cors());
app.use(morgan(':method :url :status - :response-time ms - CONTENT-TYPE: :req[Content-Type] - ACCEPT: :req[Accept]'));
morganBody(app);
app.use(json());
app.use('/api', router());

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started. PORT : ${PORT} on environment ${NODE_ENV}`);
});
