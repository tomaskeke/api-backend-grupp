const sgMail = require("@sendgrid/mail");

require("dotenv").config;

const OrderConfirmed = (orderInfo) => {
  sgMail.setApiKey(process.env.SENDGRID_KEY);
  const msg = {
    to: `${orderInfo.email}`, // Change to your recipient
    from: "tomas.ek@utb.ecutbildning.se", // Change to your verified sender
    subject: "Order confirmed",
    text: "Order is confirmed and waiting to be handled",
    html: `<h1>Hi ${orderInfo.firstname}, your order is confirmed and waiting to be handled.</h1>
    <p> Thanks for shopping at our store. You will be updated as soon as your order is processed.</p> `,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = { OrderConfirmed };
