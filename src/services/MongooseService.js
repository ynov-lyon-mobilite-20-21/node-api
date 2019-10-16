const mongoose = require('mongoose');

class MongooseService {

    constructor (model) {
        this.model = mongoose.model(model)
    }

    getOneBy = async (condition) => {
        try {
            return await this.model.findOne(condition)
        } catch (e) {
            return false
        }
    }

    create = async(userData) => {
        const newObject = new this.model(userData)

        try {
            await newObject.validate()
            return await newObject.save()
        } catch (e) {
            return false
        }
    };

    delete = async (userId) => {
        try {
            const deleteObject = await this.model.deleteOne({_id: userId})
            return deleteObject.deletedCount > 1;
        } catch (e) {
            return false
        }
    };

    update = async () => {
        try {
            //  @TODO Complete MongooseService Update Function
        } catch (e) {
            return false
        }
    };
}
