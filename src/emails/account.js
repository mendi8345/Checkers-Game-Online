const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail=(email,name)=>{
  const msg = {
    to: email,
    from: 'mendi8345@gmail.com',
    subject: `thanks for joining in!`,
    text: `welcome to the app, ${name}.let me know`
  };
  sgMail.send(msg)
}

const sendGoodByEmail=(email,name)=>{
  const msg = {
    to: email,
    from: 'mendi8345@gmail.com',
    subject: `C U `,
    text: ` ${name} good by`
  };
  sgMail.send(msg)
}
module.exports={
  sendWelcomeEmail,sendGoodByEmail
}
