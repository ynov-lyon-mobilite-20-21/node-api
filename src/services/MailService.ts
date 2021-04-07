import NodeMailer, { SendMailOptions } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

const { ENDPOINT_API, EMAIL_ADDRESS, EMAIL_PASSWORD } = process.env;

// const mailer = NodeMailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: EMAIL_ADDRESS,
//     pass: GMAIL_PASSWORD,
//   },
// });

// Change email sending to Ynov's SMTP
const mailer = NodeMailer.createTransport({
  host: 'smtp.free.fr',
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASSWORD,
  },
});

const projectName = process.env.PROJECT_NAME;
const endpoint = `${ENDPOINT_API}`;

async function getMailTemplate(template: string, replacements: object): Promise<string | boolean> {
  const html = await fs.readFileSync(`${__dirname}/../../templates/mails/${template}.html`, { encoding: 'utf-8' });

  return handlebars.compile(html)(replacements);
}

async function send(mail: SendMailOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    mailer.sendMail(mail, (err, info) => {
      if (err) {
        reject(err);
      }

      mailer.close();

      resolve(info);
    });
  });
}

export async function sendRegistrationMail(to: string, activationKey: string): Promise<boolean> {
  try {
    const activationLink = `${endpoint}/users/activate/${activationKey}`;
    const html = await getMailTemplate('registrationMail', { projectName, activationLink });

    if (!html) {
      return false;
    }

    const mail: SendMailOptions = {
      subject: `Valide ton compte sur ${projectName} !`,
      from: process.env.EMAIL_ADDRESS,
      html: html as string,
      to,
    };

    await send(mail);
    return true;
  } catch (e) {
    return false;
  }
}

export async function sendInactiveUserAccountExistMail(to: string, activationKey: string): Promise<boolean> {
  try {
    const activationLink = `${endpoint}/users/activate/${activationKey}`;
    const html = await getMailTemplate('registrationMail', { projectName, activationLink });

    if (!html) {
      return false;
    }

    const mail: SendMailOptions = {
      subject: `Tu as déjà un compte sur ${projectName} ! Active le !`,
      from: process.env.EMAIL_ADDRESS,
      html: html as string,
      to,
    };

    await send(mail);
    return true;
  } catch (e) {
    return false;
  }
}

export async function sendInvoice(to: string, invoiceLink: string): Promise<boolean> {
  try {
    const html = await getMailTemplate('invoice', { invoiceLink });

    if (!html) {
      return false;
    }

    const mail: SendMailOptions = {
      subject: `Ta facture - ${projectName}`,
      from: process.env.EMAIL_ADDRESS,
      html: html as string,
      to,
    };

    await send(mail);
    return true;
  } catch (e) {
    return false;
  }
}
