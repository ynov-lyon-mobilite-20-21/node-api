const Router = require('./Router')
const ImageService = require('../services/ImageService')

class ImageRouter extends Router {

    constructor () {
        super()

        this.post({
            endpoint: '/images',
            authentication: true,
            callback: this.createImage.bind(this),
            requiredFields: [{ name: 'url' }]
        })

        this.get({
            endpoint: '/images',
            callback: this.getAllImages.bind(this),
        })

        this.delete({
            endpoint: '/images/:id',
            authentication: true,
            callback: this.deleteImage.bind(this)
        })
    }

    async deleteImage (req) {
        const result = await ImageService.delete({_id: req.params.id})

        if (!result) {
            this.response(400, {}, {code: 'CANNOT_DELETE_IMAGE'})
            return;
        }

        this.response(200, {message: `Image ${req.params.id} is now deleted.`})
    };

    async createImage(req) {
        const result = await ImageService.create(req.body);

        if (!result) {
            return this.response(400, {}, {code: 'CANNOT_CREATE_IMAGE'})
        }

        this.response(200, result)
    }

    async getAllImages() {
        const result = await ImageService.findManyBy({});

        if (!result) {
            this.response(400, {}, {code: 'CANNOT_GET_IMAGES'})
        }

        this.response(200, result)
    }

}

module.exports = new ImageRouter()
