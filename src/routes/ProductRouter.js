const Router = require('./Router')
const UserService = require('../services/UserService')

class ProductRouter extends Router {

    constructor() {
        super();

        this.post({
            endpoint: '/product/',
        });

        this.get({
            endpoint: '/product/:id',
        });

        this.get({
            endpoint: '/product/',
        })
        this.put({
           endpoint: '/product',
        });

        this.delete({
            endpoint: '/product',
        });
    }
}