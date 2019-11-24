const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: { type: 'string', required: true },
    __v: {type: Number, select: false},
})

module.exports = imageSchema
