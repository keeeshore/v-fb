
var AWS = require("aws-sdk");
var https = require("https");
var querystring = require('querystring');

//https://graph.facebook.com/v2.10/175166319269333/events?access_token=1231313131
//until=1534562820&fields=cover%7Bsource%7D,name,description,start_time,end_time,id&limit=10&pretty=0

//https://ux0ta12z3a.execute-api.ap-southeast-2.amazonaws.com/prod/graphs?
//type=events&since=1523111460&until=1534569900&fields=cover%7Bsource%7D,name,description,start_time,end_time,id&limit=10&pretty=0

exports.handler = function(event, context, callback) {
    console.log('Received event:==============>', JSON.stringify(event, null, 2));

    var response = {
        statusCode: 200,
        headers: {
            "x-custom-header" : "my custom header value"
        },
        body: JSON.stringify(event.queryStringParameters)
    };
    console.log("response: " + JSON.stringify(response));
    
    //callback(null, response);
    //return;
    
    var options = {
        method: 'GET',
        host: 'graph.facebook.com',
        path: '/v2.10/486715638158930/events?access_token=486715638158930|58073156dd651366a01be11e5bfdcf61&',
        json: true,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    console.log('https.request URL .....>', options.host);
    var req = https.request(options, function (res){
        var data = {};
        console.log('Received response from FB>>>>>>>>>>>>>>>>>>>>>>:', res);
        res.setEncoding('utf8');
        
        res.on('data', (responseData) => {
            console.log('responseData------------>', responseData);
            data = JSON.parse(responseData);
        });
        
        res.on('end', () => {
            console.log('No more data in response.------FB FINAL------------------->', data);
            context.done(null, { success: true, data: data });

            var response = {
                statusCode: 200,
                headers: {
                    "x-custom-header" : "my custom header value"
                },
                body: JSON.stringify(event.queryStringParameters)
            };
            console.log("response: ON END " + JSON.stringify(response));
            callback(null, response);

        });
    });
    
    req.on('error', (e) => {
      console.error('ERROR IN request:>>>>>>>>>>>>>>>>>', e);
    });

    req.write('test');

    console.log('req.end >>>>>>>>>>>>>>>>>');

    req.end();

};