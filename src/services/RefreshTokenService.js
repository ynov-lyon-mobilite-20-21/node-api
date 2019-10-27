const MongooseService = require('./MongooseService');
const moment = require('moment')
const Encrypt       = require('crypto-js')

class RefreshTokenService extends MongooseService{

    constructor () {
        super('RefreshToken')
    }

    async createRefreshToken(userId) {
        const expirationTime = moment().add(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME, 'seconds').unix()
        const token = Encrypt.SHA256(`${userId}.${moment().unix()}.${expirationTime}`).toString()

        return await this.create({
            token: token,
            expirationDate: expirationTime,
            userId: userId
        })
    }

    isValid(refreshToken) {
        return refreshToken.expirationDate > moment().unix()
    }

    // async _disableOlfRefreshToken(user, newRefreshTokenId) {
    //     const refreshTokens = this.findManyBy({ userId: user.id, active: true });
    //
    //     const idArray = [];
    //     refreshTokens.forEach( refreshToken => {
    //         if (refreshToken.id === newRefreshTokenId) {
    //             return
    //         }
    //
    //         idArray.push(refreshToken.id)
    //     })
    //     this.updateMany({ _id: idArray }, { active: false })
    // }

}
module.exports = new RefreshTokenService();
