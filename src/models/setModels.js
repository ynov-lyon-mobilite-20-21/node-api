sconst mongoose = require('mongoose')

const userSchema = require('./UserModel')
const refreshToken = require('./RefreshToken')

function setModels() {
    mongoose.model('User', userSchema)
    mongoose.model('RefreshToken', refreshToken)
}

module.exports = setModels
