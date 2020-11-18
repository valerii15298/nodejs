const mongoose = require('mongoose')

module.exports = mongoose.model(
    "Product",
    new mongoose.Schema(
        {
            title: String,
            price: Number,
            manufacturer: String,
            expiration_date: Date,
            unit: String,
            amount: Number
        }
    )
)