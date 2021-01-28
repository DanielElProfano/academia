
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken)
console.log(accountSid,authToken);
client.messages.create
        ({
            body: 'Hi there!', 
            from: '+18186865971', 
            to: '+34686558335'
        })
        .then(message => console.log(message.sid))
        .catch((err) => console.log(err))