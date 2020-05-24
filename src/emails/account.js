const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'mendi8345@gmail.com',
        subject: `thanks for joining in!`,
        text: `Hello and  welcome to mendi's checkers app,\n ${name}. please let us know how can we get any bether`
    };
    sgMail.send(msg)
}

const sendGoodByEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'mendi8345@gmail.com',
        subject: `C U `,
        text: ` ${name} good by`
    };
    sgMail.send(msg)
}
module.exports = {
    sendWelcomeEmail,
    sendGoodByEmail
}