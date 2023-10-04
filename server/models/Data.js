// server/models/Data.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    message: String,
    additionalMessage: String, // Nuevo campo para el mensaje adicional
    amount: String,
    ufValor: String,
});

module.exports = mongoose.model('Data', dataSchema);
