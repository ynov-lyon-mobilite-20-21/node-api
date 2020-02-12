const Router = require('./Router')
const ProductService = require('../services/ProductService')

class ProductRouter extends Router {

    constructor () {
        super()

        this.post({
            endpoint: '/products',
            authentication: true,
            callback: this.createProduct.bind(this),
            requiredFields: [{ name: 'price', format: 'number' }, { name: 'name' }, { name: 'description' }, { name: 'category' }, { name: "images", format: "array" }]
        })

        this.get({
            endpoint: '/products/:id',
            callback: this.getOneById.bind(this)
        })

        this.get({
            endpoint: '/products',
            callback: this.getAllProducts.bind(this),
        })

        this.put({
            endpoint: '/products/:id',
            authentication: true,
            callback: this.updateUser.bind(this),
            requiredFields: [{ name: 'price', format: 'number' }, { name: 'name' }, { name: 'description' }, { name: 'category' }, { name: "images", format: "array" }]
        })

        this.delete({
            endpoint: '/products/:id',
            authentication: true,
            callback: this.deleteProduct.bind(this)
        })
    }

    async updateUser (req) {
        const productUpdate = await ProductService.updateOne({_id: req.params.id}, req.body)

        if (!productUpdate) {
            this.response(400, {}, {code: 'CANNOT_UPDATE_PRODUCT'})
            return
        }

        this.response(200, {message: `Product ${req.params.id} was updated.`})
    }

    async deleteProduct (req) {
        const userDeletion = await ProductService.delete({_id: req.params.id})
        console.log(userDeletion)

        if (!userDeletion) {
            this.response(400, {}, {code: 'CANNOT_DELETE_PRODUCT'})
            return;
        }

        this.response(200, {message: `Product ${req.params.id} is now deleted.`})
    };

    async createProduct(req) {
        const productCreation = await ProductService.createProduct(req.body);

        if (!productCreation) {
            return this.response(400, {}, {code: productCreation.code})
        }

        this.response(200, productCreation)
    }

    async getAllProducts() {
        const products = await ProductService.findManyBy({});

        if (!products) {
            this.response(400, {}, {code: 'CANNOT_GET_PRODUCTS'})
        }

        this.response(200, products)
    }

    async getOneById(req) {
        const product = await ProductService.findOneBy({ _id: req.params.id });

        if (!product) {
            this.response(400, {}, {code: 'CANNOT_GET_PRODUCT'})
        }

        this.response(200, product)
    }
}

module.exports = new ProductRouter()
