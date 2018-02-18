/*
  id
  wall_id
  date_opened
  date_closed
  difficulty
  color
*/

var Routes = function(db) {
  this.Users_col = db.collection('Routes');
};

Routes.prototype.getByID = function (id, next) {
  this.Users_col.findOne({ id: id }, function (err, user) {
    if (err) { return next(err); }
    return next(null, user);
  });
};

Routes.prototype.getAllActiveByWallID = function (wid, next) {
  let now = new Date();
  this.Users_col.find({ wall_id: wid, date_closed: { $in: [undefined, null] } }.toArray(function(err, routes) {
    if (err) { return next(err); }
    return next(null, routes);
  }));
};

Routes.prototype.insert = function (new_user, next) {
  this.Users_col.insert(new_user, function(err, inserted) {
    if (err) {
      return next(err);
   }
   return next(null, inserted);
   });
};

module.exports = Routes;
