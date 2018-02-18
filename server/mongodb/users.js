/*
  id
  displayName
  email
  picture
  gender
  provider
  revoke_app_url
  lang
  birthdate
*/

var Users = function(db) {
  this.Users_col = db.collection('Users');
};

Users.prototype.getByID = function (id, next) {
  this.Users_col.findOne({ id: id }, function (err, user) {
    if (err) { return next(err); }
    return next(null, user);
  });
};

Users.prototype.insert = function (new_user, next) {
  this.Users_col.insert(new_user, function(err, inserted) {
    if (err) {
      return next(err);
   }
   return next(null, inserted);
   });
};

module.exports = Users;
