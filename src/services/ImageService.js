const MongooseService = require('./MongooseService')

class ImageService extends MongooseService {

    constructor () {
        super('Image')
    }

}

module.exports = new ImageService()
