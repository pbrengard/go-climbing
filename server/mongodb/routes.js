/*
  id
  wall_id
  created
  creator
  date_closed
  closed_by
  grade_id
  color
*/

let ObjectID = require('mongodb').ObjectID;

var Routes = function(db) {
  this.Routes_col = db.collection('Routes');
};

Routes.prototype.getByID = function (id, next) {
  this.Routes_col.findOne({ _id: id }, function (err, route) {
    if (err) { return next(err); }
    return next(null, route);
  });
};

Routes.prototype.getAllActive = function (next) {
  let now = new Date();
  this.Routes_col.find({ date_closed: { $in: [undefined, null] } }).toArray(function(err, routes) {
    if (err) { return next(err); }
    return next(null, routes);
  });
};

Routes.prototype.getAllActiveByWallID = function (wid, next) {
  let now = new Date();
  this.Routes_col.find({ wall_id: wid, date_closed: { $in: [undefined, null] } }).toArray(function(err, routes) {
    if (err) { return next(err); }
    return next(null, routes);
  });
};

Routes.prototype.insert = function (new_route, next) {
  this.Routes_col.insert(new_route, function(err, inserted) {
    if (err) {
      return next(err);
   }
   return next(null, inserted);
   });
};

Routes.prototype.close = function (route_id, date_closed, closed_by, next) {
  this.Routes_col.updateOne({_id: new ObjectID(route_id)}, { $set: { "date_closed" : date_closed, "closed_by" : closed_by } }, function (err, updated) {
    if (err) {
      return next(err);
    }
    if (updated.modifiedCount == 0) {
      return next("nothing done");
    }
    return next(null);
  });
};

module.exports = Routes;
