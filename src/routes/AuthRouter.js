const Router = require('./Router')
const AuthService = require('../services/AuthService')
const RefreshTokenService = require('../services/RefreshTokenService')
const UserService = require('../services/UserService')

class AuthRouter extends Router {

  constructor () {
    super()

    this.post({
      endpoint: '/auth',
      callback: this.authentication.bind(this),
      requiredFields: [{name: 'mail', format: 'email'}, {name: 'password'}]
    })

    this.post({
      endpoint: '/auth/refresh',
      callback: this.refresh.bind(this),
      requiredFields: [{name: 'refreshToken'}]
    })
  }

  async authentication (req) {
    const user = await UserService.findOneBy({mail: req.body.mail}, ['password'])

    if (!user || !await UserService.comparePassword(req.body.password, user.password)) {
      return this.response(401, {}, {
        code: 'BAD_CREDENTIALS',
        message: 'Invalid password or mail'
      })
    }

    const refreshToken = await RefreshTokenService.createRefreshToken(user.id)
    const token = await AuthService.createTokens(user.id)

    this.response(200, {token, refreshToken: refreshToken.token})
  }

  async refresh (req) {
    const refreshToken = await RefreshTokenService.findOneBy({ token: req.body.refreshToken })

    if (!refreshToken.active || !RefreshTokenService.isValid(refreshToken)) {
      this.response(401, {}, { code: 'INVALID_REFRESH_TOKEN' })
      return;
    }

    const user = await UserService.findOneBy({ _id: refreshToken.userId })
    const newRefreshToken = await RefreshTokenService.createRefreshToken(user.id)
    const newToken = await AuthService.createTokens(user.id)

    this.response(200, {token: newToken, refreshToken: newRefreshToken.token})

    refreshToken.active = false;
    await RefreshTokenService.updateOne({ token: refreshToken.token }, refreshToken);
  }
}

module.exports = new AuthRouter()
