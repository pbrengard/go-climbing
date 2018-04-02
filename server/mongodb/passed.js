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

Passed.prototype.latest = function(limit, next) {
  this.Passed_col.aggregate([
      { $lookup:
        {
          from: "Routes",
          localField: "_id.route_id",
          foreignField: "_id",
          as: "routeinfo"
        }
      },
      { $lookup:
        {
          from: "Users",
          localField: "_id.user_id",
          foreignField: "id",
          as: "userinfo"
        }
      },
      { "$sort": { "date_passed": -1 } },
      { "$limit": limit },
      { "$unwind": "$routeinfo" },
      { "$unwind": "$userinfo" },
  ]
  , function(err, cursor) {
    if (err) return next(err);
    
    /*
    cursor.get(function(err, res) {
      console.log(res) 
    })*/
    
    //console.dir(cursor[0]);
    cursor.toArray(function(err2, results) {
      if (err2) return next(err2);
      //console.log(results);
      return next(null, results);
    });
  });
};

module.exports = Passed;
