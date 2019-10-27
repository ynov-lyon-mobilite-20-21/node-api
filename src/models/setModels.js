const mongoose = require('mongoose')

const userSchema = require('./UserModel')

function setModels() {
    mongoose.model('User', userSchema)
}

module.exports = setModels
