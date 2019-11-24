const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: 'string', required: true },
    price: { type: 'number', required: true },
    description: { type: 'string' },
    category: { type: 'string' },
    images: { type: 'array' },
    __v: {type: Number, select: false},
})

module.exports = productSchema
