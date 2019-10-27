// const refreshTokenRoute = async (req, res) => {
//     //  @TODO: AuthService GetOneBy (token)
//     const token = await AuthHelper.getRefreshTokenBy({ token: req.body.refreshToken })
//
//     if (!token.active || !AuthHelper.refreshTokenIsValid(token)) {
//         JSONResponse({
//             res,
//             statusCode: 401,
//             dataObject: {
//                 message: "Invalid Refresh Token"
//             }
//         })
//
//         return
//     }
//
//     const user = await UserHelper.getOneUserBy({ _id: token.userId })
//     const tokens = await AuthHelper.createTokens(user)
//
//     JSONResponse({
//         res,
//         statusCode: 200,
//         dataObject: tokens
//     })
// }
//
//
// router.post('/refresh', refreshTokenRoute)
// router.post('/', authenticationRoute);

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
        const user = await UserService.findOneBy({ mail: req.body.mail });

        if (!user || user.password !== UserService.encryptPassword(req.body.password, user.mail) ) {
            return this.response(401, {}, {
                code: "BAD_CREDENTIALS",
                message: "Invalid password or mail"
            })
        }

        const refreshToken = await RefreshTokenService.createRefreshToken(user.id);
        const token = await AuthService.createTokens(user.id);

        this.response(200, { token, refreshToken: refreshToken.token })
    }

    // async refresh(req) {
    //     const
    // }
}

module.exports = new AuthRouter();
