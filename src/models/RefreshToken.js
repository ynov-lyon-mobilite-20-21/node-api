const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    token: { type: 'string', unique: true, required: true },
    expirationDate: { type: 'number', required: true },
    userId: { type: 'string', required: true },
    active: { type: 'boolean', required: true, default: true }
})

module.exports = refreshTokenSchema
