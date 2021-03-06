'use strict';

var util              = require('util');
var ResultSet         = require('./ResultSet');
var Connection        = require('./Connection');
var ResultSetMetaData = require('./ResultSetMetaData');
var DbBase            = require('../common/DbBase');

module.exports = DB;

function DB(dbReqOptions) {

  DbBase.call(this, dbReqOptions);

  this.ResultSet = ResultSet.prototype;
  this.ResultSetMetaData = ResultSetMetaData.prototype;
  this.getConnection = function (arg, isolationLevel) {
    var userOptions;
    switch (typeof arg) {
    case 'undefined':
      userOptions = { isolationLevel: isolationLevel };
      break;
    case 'number':
      userOptions = { isolationLevel: arg };
      break;
    case 'string':
      userOptions = { sqlcc: arg, isolationLevel: isolationLevel };
      break;
    case 'object':
      userOptions = arg || {};
      break;
    default:
      throw new TypeError('Invalid parameters for "$.db.getConnection", check function signature in the documentation');
    }
    return new Connection(this._getClient(userOptions));
  };
}

util.inherits(DB, DbBase);
