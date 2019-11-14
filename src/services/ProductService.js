const MongooseService = require('./MongooseService')

class ProductService extends MongooseService {

    constructor () {
        super('Product')
    }

}

module.exports = new ProductService()
