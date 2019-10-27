const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    mail: { type: 'string', unique: true, required: true },
    password: 'string',
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    birthday: { type: 'number' },
    registrationDate: { type: 'number' },
    active: { type: 'boolean', required: true },
    activationKey: { type:'string' }
})

module.exports = userSchema
