const jwt = require('jsonwebtoken')
const RefreshTokenService = require('./RefreshTokenService')
const UserService = require('./UserService')

class AuthService {

  async createTokens (userId) {
    return jwt.sign({user: userId}, process.env.SECRET_KEY, {expiresIn: Number(process.env.JWT_TOKEN_EXPIRATION_TIME)})
  }

  async verifyToken (token, cb) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err || !decoded) {
        cb(null, false)
        return
      }

      let user = await UserService.findOneBy({_id: decoded.user})

      if (!user) {
        cb(null, false)
        return
      }

      return cb(null, user)
    })
  }

}

module.exports = new AuthService()
