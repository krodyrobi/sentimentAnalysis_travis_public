'use strict';

var bigNumber = require('big-number').n;

var MAX_INT64 = '9223372036854775807'; // 2^64 / 2 - 1
var MIN_INT64 = '-9223372036854775808'; // -(2^64 / 2)
var MAX_UINT64 = '18446744073709551615'; // 2^64 - 1

var ctypes = {};
function Int64(val) {
  var sVal = val;
  if (val instanceof ctypes.Int64 || val instanceof ctypes.UInt64) {
    sVal = val.valueOf();
  }
  if (typeof sVal === 'string' && (sVal.indexOf('0x') === 0 || sVal.indexOf('-0x') === 0)) {
    sVal = parseInt(sVal, 16);
  }
  _validateInt64(sVal);

  if (!(this instanceof ctypes.Int64 || this instanceof ctypes.UInt64)) {
    return new ctypes.Int64(sVal);
  }
  this._val = sVal;
}

function UInt64(val) {
  var sVal = val;
  if (val instanceof ctypes.Int64 || val instanceof ctypes.UInt64) {
    sVal = val.valueOf();
  }
  if (typeof sVal === 'string' && (sVal.indexOf('0x') === 0 || sVal.indexOf('-0x') === 0)) {
    sVal = parseInt(sVal, 16);
  }
  _validateUInt64(sVal);

  if (!(this instanceof ctypes.Int64 || this instanceof ctypes.UInt64)) {
    return new ctypes.UInt64(sVal);
  }
  this._val = sVal;
}

function valueOf() {
  return this._val.toString();
}

function _compare(n1, n2) {
  var a = bigNumber(n1.valueOf());
  var b = bigNumber(n2.valueOf());

  if (a.gt(b)) {
    return 1;
  } else if (a.equals(b)) {
    return 0;
  } else {
    return -1;
  }
}

function _validateInt64(val) {
  var isInt64String = isInteger(val) && _compareNumericStrings(val, MAX_INT64) <= 0 && _compareNumericStrings(val, MIN_INT64) >= 0;

  if (!isInt64String) {
    throw new Error('expected type int64, got ' + JSON.stringify(val));
  }
}

function _validateUInt64(val) {
  var isUInt64String = isInteger(val) && _compareNumericStrings(val, MAX_UINT64) <= 0 && _compareNumericStrings(val, '0') >= 0;

  if (!isUInt64String) {
    throw new Error('expected type uint64, got ' + JSON.stringify(val));
  }
}

function _compareInt64(n1, n2) {
  if (!(n1 instanceof ctypes.Int64) || !(n2 instanceof ctypes.Int64)) {
    throw new Error('compare takes two Int64 arguments');
  }
  return _compare(n1, n2);
}

function _compareUInt64(n1, n2) {
  if (!(n1 instanceof ctypes.UInt64) || !(n2 instanceof ctypes.UInt64)) {
    throw new Error('compare takes two UInt64 arguments');
  }
  return _compare(n1, n2);
}

function _compareNumericStrings(n1, n2) {
  n1 = n1.toString();
  n2 = n2.toString();
  var normalizedPair;
  if (n1.indexOf('-') === -1 && n2.indexOf('-') === -1) {
    normalizedPair = _normalizePairWithLeadingZeros(n1, n2);
    n1 = normalizedPair.n1;
    n2 = normalizedPair.n2;
    return (n1 > n2) ? 1 : (n1 === n2) ? 0 : -1;
  } else if (n1.indexOf('-') === 0 && n2.indexOf('-') === -1) {
    return -1;
  } else if (n1.indexOf('-') === -1 && n2.indexOf('-') === 0) {
    return 1;
  } else if (n1.indexOf('-') === 0 && n2.indexOf('-') === 0) {
    n1 = n1.substring(1, n1.length);
    n2 = n2.substring(1, n2.length);
    normalizedPair = _normalizePairWithLeadingZeros(n1, n2);
    n1 = normalizedPair.n1;
    n2 = normalizedPair.n2;
    return (n1 < n2) ? 1 : (n1 === n2) ? 0 : -1;
  }
}

function _normalizePairWithLeadingZeros(n1, n2) {
  var diff;
  var prefix;
  if (n1.length > n2.length) {
    diff = n1.length - n2.length;
    prefix = new Array(diff + 1).join('0');
    n2 = prefix.concat(n2);
  } else if (n1.length < n2.length) {
    diff = n2.length - n1.length;
    prefix = new Array(diff + 1).join('0');
    n1 = prefix.concat(n1);
  }
  return {n1: n1, n2: n2};
}

function toJSON() {
  return this._val;
}

function isInteger(value) {
  if (isNaN(value)) {
    return false;
  }
  value = parseFloat(value);
  return Number(value) === value && value % 1 === 0;
}

Int64.prototype.toJSON = toJSON;
UInt64.prototype.toJSON = toJSON;
Int64.prototype.valueOf = valueOf;
UInt64.prototype.valueOf = valueOf;
Int64.prototype.toString = valueOf;
UInt64.prototype.toString = valueOf;
ctypes.Int64 = Int64;
ctypes.UInt64 = UInt64;
ctypes.Int64.compare = _compareInt64;
ctypes.UInt64.compare = _compareUInt64;
ctypes.MAX_INT64 = MAX_INT64;
ctypes.MIN_INT64 = MIN_INT64;
ctypes.MAX_UINT64 = MAX_UINT64;

module.exports = ctypes;
