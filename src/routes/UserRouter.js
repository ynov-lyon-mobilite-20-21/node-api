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
      endpoint: '/users/activation',
      callback: this.activeUser.bind(this),
      requiredFields: [{name: 'userId'}, {name: 'activationKey'}, {name: 'password'}]
    })

    this.get({
      endpoint: '/users/:userId',
      callback: this.getUser.bind(this),
      authentication: true
    })

    this.get({
      endpoint: '/users',
      callback: this.getAllUsers.bind(this),
      authentication: true
    })

    this.put({
      endpoint: '/users/:userId',
      callback: this.updateUser.bind(this),
      authentication: true,
      requiredFields: [{name: 'password'}]
    })

    this.put({
      endpoint: '/users/admin/:userId',
      callback: this.updateUserByAdmin.bind(this),
      authentication: true
    })

    this.delete({
      endpoint: '/users/:userId',
      callback: this.deleteUser.bind(this),
      authentication: true
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
    const userDeletion = await UserService.delete({_id: req.params.userId})

    if (!userDeletion) {
      this.response(400, {}, {code: 'CANNOT_DELETE_USER'})
      return;
    }

    this.response(200, {message: `User ${req.params.userId} is now deleted.`})
  };

  async updateUser (req) {
    const user = await UserService.findOneBy({_id: req.params.userId}, ['password'])
    if (!user) {
      this.response(400, {}, {code: 'USER_DOESNT_EXISTS'})
      return
    }

    if(!await UserService.comparePassword(req.body.password, user.password)) {
      this.response(400, {}, {code: 'INCORRECT_PASSWORD'})
      return
    }

    const userUpdate = await UserService.updateOne({_id: req.params.userId}, req.body)

    if (!userUpdate) {
      this.response(400, {}, {code: 'CANNOT_UPDATE_USER'})
      return
    }

    this.response(200, {message: `User ${req.params.userId} was updated.`})
  };

  async updateUserByAdmin (req) {
    if (!req.user.isAdmin) {
      this.response(401, {}, {code: 'NEED_ADMIN_PRIVILEGES'})
      return
    }

    const userUpdate = await UserService.updateOne({_id: req.params.userId}, req.body)

    if (!userUpdate) {
      this.response(400, {}, {code: 'CANNOT_UPDATE_USER'})
      return
    }

    this.response(200, {message: `User ${req.params.userId} was updated.`})
  };

  async getUser (req) {
    const user = await UserService.findOneBy({_id: req.params.userId})

    if (!user) {
      this.response(400, {}, {code: 'CANNOT_GET_USER'})
    }

    this.response(200, user)
  };

  async getAllUsers (req) {
    const users = await UserService.findManyBy({})

    if (!users) {
      this.response(400, {}, {code: 'CANNOT_GET_USERS'})
    }

    this.response(200, users)
  };

}

module.exports = new UserRouter()
