/**
 * Created by balank on 5/12/2016.
 */
module.exports = function (app, dbase, mongodb) {

    var schoolCollection = dbase.collection('schoolcollection');
    var classCollection = dbase.collection('classcollection');

    return function () {

        console.log('INIT CLASS API');

        app.get('/api/class/get', function (req, res) {
            debugger;
            console.log("GET CLASS----------------- api/class/get =========== " + JSON.stringify(req.params) + " ::: " + JSON.stringify(req.query));
            var schoolId = new mongodb.ObjectId(req.query.schoolId);
            classCollection.find({'schoolId': req.query.schoolId}).sort({'std': 1}).toArray(function(err, docs) {
                console.log('console.log::schoolCollection find().toArray()-----------' + docs);
                res.json({'classes': docs});
            });
        });

        app.post('/api/class/add', function (req, res) {
            console.log("ADD CLASS----------------- api/class/add =========== " + JSON.stringify(req.body));
            //var schoolId = new mongodb.ObjectId(req.body.schoolId);
            classCollection.insert({
                'std': req.body.std,
                'teacherId': req.body.teacherId,
                'schoolId': req.body.schoolId
            }, function (err, db){
                if (err) {
                    console.log('failed to add school');
                }
                res.json({'success': true});
            });
        });

        app.post('/api/class/update', function (req, res) {
            console.log("UPDATE CLASS----------------- api/class/add =========== " + JSON.stringify(req.body));
            var _id = new mongodb.ObjectId(req.body._id);
            classCollection.update(
                {
                    'schoolId': req.body.schoolId,
                    '_id': _id
                },
                {
                    $set: {
                        'std': req.body.std,
                        'teacherId': req.body.teacherId
                    }
                }, function (err, db){
                    if (err) {
                        console.log('failed to edit school');
                    }
                    res.json({'success': true});
                }
            );
        });

        app.post('/api/class/delete', function (req, res) {
            console.log('DELETE CLASS----------------- api/class/add =========== ' + JSON.stringify(req.body));
            var _id = new mongodb.ObjectId(req.body._id);
            classCollection.findOneAndDelete(
                {
                    '_id': _id
                }, function (err, db){
                    if (err) {
                        console.log('failed to edit school');
                    }
                    res.json({'success': true});
                }
            );
        });

    }();



};