const mongoose = require('mongoose')

class MongooseService {

    constructor (model) {
        this.model = mongoose.model(model)
    }

    async getOneBy (condition) {
        try {
            return await this.model.findOne(condition)
        } catch (e) {
            return false
        }
    }

    async create (userData) {
        const newObject = new this.model(userData)

        try {
            await newObject.validate()
            return await newObject.save()
        } catch (e) {
            return false
        }
    }

    async delete (userId) {
        try {
            const deleteObject = await this.model.deleteOne({_id: userId})
            return deleteObject.deletedCount > 1
        } catch (e) {
            return false
        }
    };

    async update (condition, propertiesToSet) {
        try {
            const update = await this.model.updateOne(condition, { $set: propertiesToSet, $inc: { __v: 1 } });
            return update.nModified > 0;
        } catch (e) {
            return false
        }
    };
}

module.exports = MongooseService;
