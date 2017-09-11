/**
 * Created by balank on 5/12/2016.
 */
module.exports = function (app, dbase, mongodb) {

    var moment = require('moment');
    var https = require("https");

    var schoolCollection = dbase.collection('schoolcollection');
    var classCollection = dbase.collection('classcollection');

    console.log('INIT SCHOOL API');

    app.post('/api/schools/add', function (req, res) {
        debugger;
        console.log("POST----------------- api/schools/add =========== " + JSON.stringify(req.body));
        schoolCollection.insert({
            'name': req.body.name,
            'type': req.body.type,
            'head': req.body.head
        }, function (err, db){
            if (err) {
                console.log('failed to add school');
            }
            res.json({'success': true});
        });
    });

    app.post('/api/schools/delete', function (req, res) {
        console.log("POST----------------- api/schools/delete =========== " + JSON.stringify(req.body));
        var _id = new mongodb.ObjectId(req.body._id);
        schoolCollection.findOneAndDelete({'_id': _id }, function (err, db){
            if (err) {
                console.log('failed to add school');
            }
            res.json({'success': true});
        });
    });

    app.post('/api/schools/update', function (req, res) {
        console.log("POST----------------- api/schools/update =========== " + req.body);
        var _id = new mongodb.ObjectId(req.body._id);
        schoolCollection.update(
            { '_id': _id },
            {
                $set: {
                    'name': req.body.name,
                    'type': req.body.type,
                    'head': req.body.head
                }
            },
            function (err, db){
                if (err) {
                    console.log('failed to update school' + err);
                }
                res.json({'success': true});
            }
        );
    });

    app.get('/api/schools/get', function (req, res) {
        console.log("GET----------------- api/schools/get =========== ");
        schoolCollection.find().toArray(function(err, docs) {
            console.log('console.log::schoolCollection find().toArray()-----------' + docs);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.json({'schools': docs});
        });
    });

};