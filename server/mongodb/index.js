const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

const config = require("../config");
var Users = require("./users");
var Routes = require("./routes");
var Passed = require("./passed");

var Mongo = function () {
  MongoClient.connect(config.mongo_url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to MongoDB server");
    
    this.client = client;
    this.db = client.db(config.dbName);
  }.bind(this));
};

Mongo.prototype.close = function () {
  this.client.close();
};

Mongo.prototype.users = function () {
  if (!this._users) {
      this._users = new Users(this.db);
  }
  return this._users;
};

Mongo.prototype.routes = function () {
  if (!this._routes) {
      this._routes = new Routes(this.db);
  }
  return this._routes;
};

Mongo.prototype.passed = function () {
  if (!this._passed) {
      this._passed = new Passed(this.db);
  }
  return this._passed;
};

module.exports = new Mongo();
