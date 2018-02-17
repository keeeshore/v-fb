
var AWS = require("aws-sdk");

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