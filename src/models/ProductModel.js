const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    name: { type: 'string', required: true },
    price: { type: 'number', required: true },
    description: { type: 'string' },
    images: [{ type: 'string' }],
})

module.exports = refreshTokenSchema