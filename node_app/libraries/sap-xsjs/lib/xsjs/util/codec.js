'use strict';

var _ = require('lodash');
var buffUtils = require('../../utils/buffer-utils');

module.exports.decodeBase64 = function decodeBase64(base64Data) {
  checkIsString(base64Data);
  return buffUtils.toArrayBuffer(new Buffer(base64Data, 'base64'));
};

module.exports.decodeHex = function decodeHex(hexData) {
  checkIsString(hexData);
  return buffUtils.toArrayBuffer(new Buffer(hexData, 'hex'));
};

module.exports.encodeBase64 = function encodeBase64(data) {
  return toBuffer(data).toString('base64');
};

module.exports.encodeHex = function encodeBase64(data) {
  return toBuffer(data).toString('hex');
};

function checkIsString(data) {
  if (!_.isString(data)) {
    throw new Error('Input parameter must be String');
  }
}

function toBuffer(data) {
  data = buffUtils.getData(data);
  return _.isString(data) ? new Buffer(data) : data;
}
