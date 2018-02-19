var https = require('https');

exports.handler = (event, context, callback) => {
    // TODO implement
    console.log('Received event:', JSON.stringify(event, null, 2));
    var userName = event.userName;
    var password = event.password;
    var recaptha = event.recapthca;
    
    var postData = {
        secret: '6Lelvj8UAAAAANHT_JxRUVSka6Dz5NPl74JLeeX_',
        recaptha: recaptha
    };
    
    var options = {
        method: 'GET',
        host: 'www.google.com',
        path: '/recaptcha/api/siteverify?secret='+ postData.secret +'&response=' + postData.recaptha,
        json: true,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    var req = https.request(options, function (res){
        var data = {};
        //console.log('Received response from google:', res);
        res.setEncoding('utf8');
        
        res.on('data', (responseData) => {
            console.log('responseData------------>', responseData);
            data = JSON.parse(responseData);
        });
        
        res.on('end', () => {
            console.log('No more data in response.------FINAL------------------->', data);
            if (data && data.success) {
                console.log('>>>data.success------->::::::::::::::::::', data);
                if (userName === 'kishore' && password === 'admin') {
                    context.done(null, { success: true, message: 'Login Successfull' });
                } else {
                     context.done(null, { success: false, message: 'Invalid Credentials' });
                }
            } else {
                console.log('>>>data.FAIL------->::::::::::::::::', data);
                context.done(null, { success: false, message: 'Invalid Captcha Code' });
            }
        });
        
        
    });
    
    req.on('error', (e) => {
      console.error('ERROR IN request:>>>>>>>>>>>>>>>>>', e);
      context.done(null, { success: false, message: 'Invalid Captcha Code' });
    });
    
    //console.log('write data to request body>>>>>>>>>>>>>>>>>', postData);
    req.write('{"secret": "Hello, World", "response": "Hello, World"}');
    console.log('req.end >>>>>>>>>>>>>>>>>');
    
    req.end();
};