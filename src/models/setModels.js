const mongoose = require('mongoose')

const userSchema = require('./UserModel')
const refreshToken = require('./RefreshToken')
const productSchema = require('./ProductModel')
const imageSchema = require('./ImageModel')

function setModels() {
    mongoose.model('User', userSchema)
    mongoose.model('RefreshToken', refreshToken)
    mongoose.model('Product', productSchema)
    mongoose.model('Image', imageSchema)
}

module.exports = setModels
