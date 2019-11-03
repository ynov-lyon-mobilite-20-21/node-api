const Crypto = require('crypto');
const MongooseService = require('./MongooseService');
const MailService = require('./MailService');
const bcrypt = require('bcrypt');

class UserService extends MongooseService {

    constructor () {
        super('User')
    }

    async createUser(params) {
        const userInDb = await this.findOneBy({ mail: params.mail });

        try {
            if (userInDb && !userInDb.active) {
                const activationLink = `${process.env.CLIENT_HOSTNAME}/user/activation?u=${userInDb._id}&k=${userInDb.activationKey}`;
                const mailIsSent = await MailService.registrationMail(userInDb.mail, activationLink)

                const {_id, mail} = userInDb;

                return {success: true, data: { user: { _id, mail }, userExist: true, mailIsSent }};
            } else if (userInDb && userInDb.active) {
                return { success: false, code: 'MAIL_ALREADY_USING' };
            } else {
                params.activationKey = Crypto.randomBytes(50).toString('hex')
                params.active = false;

                const newUser = await this.create(params);
                const activationLink = `${process.env.CLIENT_HOSTNAME}/user/activation?u=${newUser._id}&k=${newUser.activationKey}`
                const mailIsSent = await MailService.registrationMail(newUser.mail, activationLink)

                const {_id, mail} = newUser;

                return {success: true, data: { user: { _id, mail } ,userExist: false, mailIsSent }};
            }
        } catch (e) {
            console.log(e)
            return false
        }

    }

    async activeUser ({ userId, activationKey, password }) {
        const user = await this.findOneBy({ _id: userId });

        try {
            if (!user) {
                return { success: false, code: 'USER_DONT_EXISTS' };
            }

            if (user.active) {
                return { success: false, code: 'USER_ALREADY_ACTIVE' };
            }

            if (user.activationKey !== activationKey) {
                return { success: false, code: 'INVALID_ACTIVATION_KEY' }
            }

            await this.updateOne({ _id: user.id }, {
                password: await bcrypt.hash(password, 15),
                active: true,
                activationKey: null,
                registrationDate: Date.now()
            })

            return { success: true };
        } catch (e) {
            return { success: false, code: 'UNKNOWN_ERROR' };
        }
    }

    async updateOne (params) {
        const {password, ...user} = params;
        user.password = await bcrypt.hash(password, 15);

        return super.updateOne(params);
    }
}

module.exports = new UserService();
