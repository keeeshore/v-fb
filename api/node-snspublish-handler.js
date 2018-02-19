
var AWS = require("aws-sdk");
const request = require('request-promise');

const options = {
    method: 'POST',
    uri: 'https://requestedAPIsource.com/api',
    body: req.body,
    json: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bwejjr33333333333'
    }
}

request(options).then(function (response){
    res.status(200).json(response);
})
.catch(function (err) {
    console.log(err);
});



exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    var eventName = event.eventName || 'General';
    var name = event.name || '-';
    var email = event.email || 'none';
    var phone = event.phone || 'none';
    var comments = event.comments || 'none';
    
    var message = '\n\nName: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone + '\nComments: ' + comments;
    var sns = new AWS.SNS();
    var emailOptions = {
        Message: message, 
        Subject: eventName + " inquiry for Vimonisha.",
        TopicArn: "arn:aws:sns:ap-southeast-2:646408586357:vimonishaTopic"
    };
    var smsOptions = {
        Message: message, 
        Subject: eventName + " inquiry for Vimonisha.",
        TopicArn: "arn:aws:sns:ap-southeast-2:646408586357:vimonishaSMSTopic"
    };
    sns.publish(emailOptions, function(err, data) {
        if(err) {
            console.error('error publishing to SNS');
            context.fail(err);
        } else {
            console.info('email message published to SNS');
            sns.publish(smsOptions, function(err, data) {
                if(err) {
                    console.error('error publishing to SNS');
                    context.fail(err);
                } else {
                    console.info('sms published to SNS');
                    context.done(null, { success: true});
                }
            });
        }
    });
};