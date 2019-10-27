const MongooseService = require('./MongooseService');
const moment = require('moment')
const Encrypt       = require('crypto-js')

class RefreshTokenService extends MongooseService{

    constructor () {
        super('RefreshToken')
    }

    async createRefreshToken(user) {
        const expirationTime = moment().add(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME, 'seconds').unix()
        const token = Encrypt.SHA256(`${user.mail}.${user.registrationDate}.${expirationTime}`).toString()

        return await this.create({
            token: token,
            expirationDate: expirationTime,
            userId: user.id
        })
    }

    isValid(refreshToken) {
        return refreshToken.expirationDate > moment().unix()
    }

}
module.exports = new RefreshTokenService();
