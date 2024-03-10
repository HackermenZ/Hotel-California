const accountSid = 'ACc049dd0ffec98542974fa9d90639ed5d';
const authToken = '79085a199250000a9e94f8cf065de5e7';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'Your appointment is coming up on July 21 at 3PM',
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+8801914035818'
    })
    .then(message => console.log(message.sid))
    .done();