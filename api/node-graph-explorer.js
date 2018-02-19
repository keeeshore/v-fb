
var AWS = require("aws-sdk");
var https = require("https");
var querystring = require('querystring');

//https://graph.facebook.com/v2.10/175166319269333/events?access_token=1231313131
//until=1534562820&fields=cover%7Bsource%7D,name,description,start_time,end_time,id&limit=10&pretty=0

//https://ux0ta12z3a.execute-api.ap-southeast-2.amazonaws.com/prod/graphs?
//type=events&since=1523111460&until=1534569900&fields=cover%7Bsource%7D,name,description,start_time,end_time,id&limit=10&pretty=0

exports.handler = function(event, context, callback) {
    console.log('Recieved event:==============>', JSON.stringify(event));
    console.log('Recieved context:==============>', JSON.stringify(context));
    console.log('Recieved callback:==============>', JSON.stringify(callback));
    var urlParams = '';
    var queryObj = event.queryStringParameters;
    var keyVal;
    
    for (var params in event.queryStringParameters) {
        if (params !== 'type') {
            keyVal = params + '='  + event.queryStringParameters[params];
            urlParams += '&' + keyVal;
        }
    }

    var response = {
        statusCode: 200,
        headers: { "x-custom-header" : "my custom header value 0" },
        body: JSON.stringify({'URL': 'graph.facebook.com/v2.10/VimonishaExhibitions/' + event.queryStringParameters.type +'?' + urlParams })
    };
    
    console.log("response: " + JSON.stringify(event.queryStringParameters));
    
    //callback(null, response);
    //return;
    
    var options = {
        method: 'GET',
        host: 'graph.facebook.com',
        path: '/v2.10/VimonishaExhibitions/' + event.queryStringParameters.type +'?' + urlParams,
        resolveWithFullResponse: true,
        simple: false,
        json: true,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    var options1 = {
        method: 'GET',
        host: 'kishorebalan.com',
        path: '/api/events_get',
        resolveWithFullResponse: true,
        simple: false,
        json: true,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    console.log('https.request URL ######################....>', options.host + options.path);
    
    
    var req = https.get(options, function (res) {
        
        var dataBody = '';
        console.log('Received response from FB>>>>>>>>>>>>>>>>>>>>1>>:', res.statusCode);
        console.log('Received response from FB>>>>>>>>>>>>>>>>>>>>2>>:', res.json);
        res.setEncoding('utf8');
        
        res.on('data', function (data)  {
            
            console.log('data in response--------------->', data);
            dataBody = dataBody + data ;
            //data = JSON.parse(data);
            //process.stdout.write(data);
            
            var dataResponse = {
                statusCode: 200,
                headers: { "x-custom-header" : "my custom header value 1" },
                body: JSON.stringify(dataBody)
            };
            //callback(null, dataResponse);
            
        }).on('end', function () {
            
            console.log('end in response.------FB FINAL res ----------------1--->', dataBody);
           
            var endResponse = {
                statusCode: 200,
                headers: { "x-custom-header" : "my custom header value 2" },
                body: dataBody
            };
            console.log("response: ON END " + JSON.stringify(dataBody));
            callback(null, endResponse);
            
        });

    });
    
    req.on('error', function (e) {
        console.error('ERROR IN request:>>>>>>>>>>>>>>>>>', e);
        var response = {
                statusCode: 200,
                headers: { "x-custom-header" : "my custom header value ERR" },
                body: JSON.stringify(e)
            };
        console.log("response: ON ERROR " + JSON.stringify(response));
        callback(null, response);
    });
    
    /*req.on('response', function (response) {
      response.on('data', function (chunk) {
        console.log('BODY$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$: ' + chunk);
     });
    });*/

    //req.write('test');

    console.log('req.end >>>>>>>>>>>>>>>>>');

    req.end();

};