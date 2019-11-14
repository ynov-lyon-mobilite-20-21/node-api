const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  mail: {type: 'string', unique: true, required: true},
  password: {type: 'string', select: false},
  firstName: {type: 'string'},
  lastName: {type: 'string'},
  birthday: {type: 'number'},
  registrationDate: {type: 'number'},
  active: {type: 'boolean', required: true},
  isAdmin: {type: 'boolean', default: false},
  activationKey: {type: 'string'},
  __v: {type: Number, select: false},
})

module.exports = userSchema
