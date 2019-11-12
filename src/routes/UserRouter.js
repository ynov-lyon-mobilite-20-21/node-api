const Router = require('./Router')
const UserService = require('../services/UserService')

class UserRouter extends Router {

    constructor () {
        super()

        this.post({
            endpoint: '/users/',
            callback: this.createUser.bind(this),
            requiredFields: [{name: 'mail', format: 'email'}]
        })

        this.post({
            endpoint: '/users/active',
            callback: this.activeUser.bind(this),
            requiredFields: [{name: 'userId'}, {name: 'activationKey'}, {name: 'password'}]
        })

        this.get({
            endpoint: '/users/getCurrent',
            callback: this.getUser.bind(this),
            authentication: true
        })

        this.get({
            endpoint: '/users',
            callback: this.getAllUsers.bind(this),
            authentication: true
        })

        this.put({
            endpoint: '/users',
            callback: this.updateUser.bind(this)
        })

        this.delete({
            endpoint: '/users',
            callback: this.deleteUser.bind(this)
        })
    }

    async createUser (req) {
        const userCreation = await UserService.createUser(req.body)

        if (!userCreation.success) {
            return this.response(400, {}, {code: userCreation.code})
        }

        this.response(200, userCreation.data)
    };

    async activeUser (req) {
        const userActivation = await UserService.activeUser(req.body)

        if (!userActivation.success) {
            return this.response(400, {}, {code: userActivation.code})
        }

        this.response(200, {message: 'User is now active'})
    };

    async deleteUser (req) {
        const userDeletion = await UserService.delete({ _id: req.user.id })

        if (!userDeletion) {
            this.response(400, {}, { code: "CANNOT_DELETE_USER" })
        }

        this.response(200, { message: `User ${req.user.object.id} is now deleted.` })
    };

    async updateUser (req, res) {
        const userUpdate = await UserService.updateOne({ _id: req.user.id}, req.body)

        if (!userUpdate) {
            this.response(400, {}, { code: "CANNOT_UPDATE_USER" })
        }

        this.response(200, { message: `User ${req.user.object.id} was updated.` })
    };

    getUser (req) {
        this.response(200, req.user.object)
    };

    async getAllUsers (req) {
      const users = await UserService.findManyBy({})


      if (!users) {
        this.response(400, {}, { code: "CANNOT_GET_USERS" })
      }

      this.response(200, users)
    };

}

module.exports = new UserRouter()
