import { CronJob } from 'cron';
import moment from 'moment';
import { deleteOnyBy, findManyBy } from '../services/MongooseService';
import { RefreshToken, RefreshTokenModel } from '../models/RefreshTokenModel';

export default new CronJob('00 00 00 * * *', async () => {
  const refreshTokens = await findManyBy<RefreshToken>({ model: RefreshTokenModel, condition: {} });

  refreshTokens.forEach((token: RefreshToken) => {
    if (!token.active || token.expirationDate < moment().unix()) {
      deleteOnyBy<RefreshToken>({ model: RefreshTokenModel, condition: { _id: token._id } });
    }
  });
});
