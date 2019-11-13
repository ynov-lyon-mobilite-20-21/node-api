const Router = require('./Router');
const AuthService = require('../services/AuthService');
const RefreshTokenService = require('../services/RefreshTokenService');
const UserService = require('../services/UserService');

class AuthRouter extends Router {

    constructor () {
        super();

        this.post({
            endpoint: '/auth',
            callback: this.authentication.bind(this),
            requiredFields: [ { name: 'mail', format: 'email' }, { name: 'password' } ]
        })

        this.post({
            endpoint: '/auth/refresh'
        })
    }

    async authentication(req) {
        const user = await UserService.findOneBy({ mail: req.body.mail }, ['password']);

        if (!user || !await UserService.comparePassword(req.body.password, user.password) ) {
            return this.response(401, {}, {
                code: "BAD_CREDENTIALS",
                message: "Invalid password or mail"
            })
        }

        const refreshToken = await RefreshTokenService.createRefreshToken(user.id);
        const token = await AuthService.createTokens(user.id);

        this.response(200, { token, refreshToken: refreshToken.token, userId: user.id })
    }

    // async refresh(req) {
    //     const
    // }
}

module.exports = new AuthRouter();
