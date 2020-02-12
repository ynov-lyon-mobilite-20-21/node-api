const MongooseService = require('./MongooseService')
const { STRIPE_API_KEY } = process.env;
const stripe = require('stripe')(STRIPE_API_KEY)

class ProductService extends MongooseService {

    constructor () {
        super('Product')
    }

    async createProduct(params) {
        const { name, price } = params;

        const test = await stripe.plans.create({
            amount: price * 100,
            product: {
                name,
            }
        })

        console.log(test)

        return this.create({ ...params });
    }

}

module.exports = new ProductService()
