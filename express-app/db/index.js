const
    mongoose = require('mongoose'),
    productModel = require('../models/product.model'),

    connect = mongoose.connect(process.env.MongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true
    });

module.exports = {
    connect,

    getAll: async () => productModel.find(),
    post: async (json) => (new productModel(json)).save(),
    put: async (id, json) => productModel.findByIdAndUpdate(id, json),
    get: async (id) => productModel.findById(id),
    delete: async (id) => productModel.findByIdAndDelete(id)
}