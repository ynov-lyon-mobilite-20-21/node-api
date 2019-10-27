const Router = require('./Router');
const UserService = require('../services/UserService');

class UserRouter extends Router{

    constructor (){
        super();

        this.post({
            endpoint: '/',
            callback: this.createUser.bind(this),
            requiredFields: [{ name: 'mail', format: 'email' }]
        })

        this.post({
            endpoint: '/active',
            callback: this.activeUser.bind(this),
            requiredFields: [{ name: 'userId' }, { name: 'activationKey' },{ name: 'password' }]
        })

        this.get({
            endpoint: '/',
            callback: this.getCurrentUser.bind(this)
        })

        this.put({
            endpoint: '/',
            callback: this.updateUser.bind(this)
        })

        this.delete({
            endpoint: '/',
            callback: this.deleteUser.bind(this)
        });
    }

    async createUser (req)  {
        const userCreation = await UserService.createUser(req.body)

        if (!userCreation.success) {
            return this.response(400, {}, { code: userCreation.code })
        }

        this.response(200, userCreation)
    };

    async activeUser (req)  {
        const userActivation = await UserService.activeUser(req.body)

        if (!userActivation.success) {
            return this.response(400, {}, { code: userActivation.code })
        }

        this.response(200, { message: 'User is now active' })
    };

     deleteUser(req, res)  {
        //@TODO UserService Delete Function
    };

     updateUser(req, res)  {
        //@TODO UserService Update Function
    };

     getCurrentUser(req, res)  {
        //@TODO UserService GetOneBy Function
        //  EXAMPLE :
        const id = req.params.userId

        UserService.getOneBy({ _id: id })
    };

}

module.exports = new UserRouter();
