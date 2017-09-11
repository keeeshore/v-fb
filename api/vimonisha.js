/**
 * Created by balank on 7/02/2017.
 */

module.exports = function (app, dbase, mongodb) {

    var moment = require('moment');
    var https = require("https");
    var DATE_TIME_FORMAT = 'DD-MM-YYYY, HH:mm';
    var postCollection = dbase.collection('postcollection');

    var fb_url = 'https://graph.facebook.com/v2.8/vimonishaExhibitions';
    var access_token = 'EAACEdEose0cBAC3lpGLUl2nX1bURYwMbfztjAxMrbQlfYtigAedYZB97ezE19I2QygTL5hSoLsJCoe6R3WaZBTvggudlrvZCWxOCr6aZAmSDzbTCXQabji60Gq46AnZC82CZBmknKDs9uXoIckmdukRmfJlOWOA2AuZA57CGBsnfQZDZD';
    //https://graph.facebook.com/v2.8/vimonishaExhibitions?
    //access_token=*****&debug=all&fields=id%2Cname%2Cposts&format=json&method=get&pretty=0&suppress_http_code=1

    function getFacebookData (url, type) {
        var data = '';

        return new Promise(function (resolve, reject) {

            var request = https.get(url, function (response) {
                var buffer = '';

                response.on('data', function (chunk) {
                    buffer += chunk;
                });

                response.on('end', function (err) {
                    data = JSON.parse(buffer);
                    var arr = [];
                    var paging = {};
                    console.log('\nDEFAULT DATA ELSE data -----------------------------------\n', data, '\n----------------------------\n');
                    if (!data || data.error) {
                        console.log('\n//ERROR-----------------------------------\n', data, '\n //-----------------------------------\n');
                        resolve({
                            'success': false,
                            'error': JSON.stringify(data.error),
                            'data': data,
                            'type': type
                        });
                    } else {
                        if (type) {
                            console.log('\nDATA ELSE [type]-----------------------------------\n', data[type], '\n----------------------------\n');
                            if (data[type] && data[type].data) {
                                arr = data[type].data;
                            }
                            if (data[type] && data[type].paging) {
                                paging = data[type].paging;
                            }
                            resolve({
                                'success': true,
                                'id': data.id || 0,
                                'data': arr,
                                'paging': paging,
                                'type': type
                            });
                        } else {
                            console.log('\nDATA ELSE data -----------------------------------\n', data, '\n----------------------------\n');
                            resolve({
                                'success': true,
                                'id': 9,
                                'data': data.data || arr,
                                'paging': data.paging || paging,
                                'type': false
                            });
                        }

                    }
                });

            });

            request.end();
        });

    }

    app.post('/api/vimonisha/update/posts', function (req, res) {
        var until = moment().add(1, 'month').unix();
        var since = moment().unix();
        var postsArray = [];
        var limit = 10;
        var type = 'posts';

        if (req.body) {
            limit = req.body.limit || limit;

            if (req.body.until) {
                until = moment(req.body.until, DATE_TIME_FORMAT).unix();
                console.log('query.until present 2.....', until);
            }

            if (req.body.since) {
                since = moment(req.body.since, DATE_TIME_FORMAT).unix();
                console.log('query.since present 2.....', since);
            }

            if (req.body.accessToken) {
                access_token = req.body.accessToken;
                console.log('accessToken present .....', access_token);
            }
        }

        var query_params='id,posts.since(' + since + ').until(' + until + ').limit(' + limit + '){full_picture,description,created_time}';
        var get_url = fb_url + '?access_token=' + access_token + '&fields=' + query_params;
        console.log('\n GET_URL --------------------> \n' + get_url);
        console.log('\n---------------------------> \n');
        debugger;

        function fbData (url, type) {
            console.log('fbData called :::', url, ' type = ',  type);

            getFacebookData(url, type).then(function (response) {
                var i = 0;
                console.log('response received from getFacebookData :::', JSON.stringify(response.data));

                while (i < response.data.length) {
                    postsArray.push(response.data[i]);
                    i++;
                }

                if (response.paging && response.paging.next) {
                    console.log('\n----response.paging.next present... calling getFacebookData again::' + response.paging.next + '\n');
                    fbData(response.paging.next, false);
                } else {
                    console.log('\n<-------------------------------------------\n');
                    console.log('\nresponse.paging.next NOT present..CRUD...\n', JSON.stringify(postsArray));
                    console.log('\n------------------------------------------->\n');
                    if (postsArray.length > 0) {
                        console.log('\n---INSERT MANY ----:::');
                        postCollection.insertMany(postsArray, function (err, db) {
                            if (err) {
                                console.log('\nFailed to store posts:::' + JSON.stringify(postsArray));
                                res.json({
                                    'success': false,
                                    'msg': 'failed to store postCollection in mongo',
                                    'err': JSON.stringify(err),
                                    'posts': postsArray
                                });
                            } else {
                                console.log('\n//DATA under mongo-----------------------------------\n', postsArray[0] , '\n //-----------------------------------\n');
                                res.json({
                                    'success': true,
                                    'id': postsArray[0].id || 1,
                                    'posts': postsArray,
                                    'until' : postsArray[0].created_time
                                });
                            }
                        });

                    } else {
                        console.log('---NOT INSERTION... in else condition..success = false; -------');
                        res.json({
                            'success': false,
                            'msg': 'No data to store...in mongodb',
                            'posts': []
                        });
                    }

                }
            });
        }

        fbData(get_url, type);

    });

    app.get('/api/vimonisha/get/posts', function (req, res) {
        console.log('get called...............');
        postCollection.find().sort({created_time: -1}).toArray(function(err, docs) {
            console.log('console.log::postCollection find().toArray()-----------' + JSON.stringify(docs));
            var until = moment().unix();
            var id = '';
            if (docs.length > 0) {
                until = docs[0].created_time;
                id = docs[0]._id;
                res.json({'success': true, 'id': id, 'posts': docs, 'until' : until});
            } else {
                res.json({'success': false, 'id': id, 'posts': [], 'until' :  moment().format()});
            }

        });
    });




};


