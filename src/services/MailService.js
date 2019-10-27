const NodeMailer = require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs')

const mailer = NodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASSWORD
    }
})

class MailService {

    _send(mail) {
        return new Promise((resolve) => {
            mailer.sendMail(mail, (err) => {
                if (err) {
                    resolve(false)
                } else {
                    resolve(true)
                }
                mailer.close()
            })
        })
    }

    async _getMailTemplate(template, replacements) {
        try {
            const html = await fs.readFileSync(`${__dirname}/../templates/mails/${template}.html`, {encoding: 'utf-8'});
            return handlebars.template(html)(replacements);
        } catch (e) {
            return false
        }
    }

}

module.exports = new MailService();
