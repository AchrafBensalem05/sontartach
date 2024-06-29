const twilio = require('twilio');

const accountSid = 'AC17844281f9063db5510ed66507268d8f';
const authToken = '360ff929c2e750dc9b85c326c5a2ce0d';
const client = new twilio(accountSid, authToken);
// recovery code Q21T8N9888UFGZL9T4TS5C1Q
const sendSMS = (to, message) => {
  client.messages
    .create({
      body: message,
      from: '+213540482103',
      to,
    })
    .then((message) => console.log(message.sid))
    .catch((error) => console.log(error));
};

module.exports = sendSMS;
