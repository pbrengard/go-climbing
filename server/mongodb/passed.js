/*
  { 
    user_id
    route_id
  }
  date_passed
*/

let ObjectID = require('mongodb').ObjectID;

var Passed = function(db) {
  this.Passed_col = db.collection('Passed');
};

Passed.prototype.getByID = function (route_id, user_id, next) {
  this.Passed_col.findOne({ _id: {route_id:new ObjectID(route_id), user_id:user_id} }, function (err, passed) {
    if (err) { return next(err); }
    return next(null, !!passed, passed ? passed.date_passed : null);
  });
};

Passed.prototype.insert = function (route_id, user_id, next) {
  let now = new Date();
  this.Passed_col.insert({_id: {route_id:new ObjectID(route_id), user_id:user_id}, date_passed: now}, function(err, inserted) {
    if (err) {
      return next(err);
    }
    if (inserted.insertedCount == 0) {
      return next("nothing done");
    }
    return next(null, inserted);
  });
};

Passed.prototype.remove = function (route_id, user_id, next) {
  this.Passed_col.remove({_id: {route_id:new ObjectID(route_id), user_id:user_id}}, function(err, WriteResult) {
    if (err) {
      return next(err);
   }
   if (WriteResult.nRemoved == 0) {
       return next("nothing done");
   }
   return next(null);
   });
};

module.exports = Passed;
