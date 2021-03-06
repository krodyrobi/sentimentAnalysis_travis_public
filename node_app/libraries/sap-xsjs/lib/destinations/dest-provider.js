'use strict';

var _ = require('lodash');
var assert = require('assert');
var VError = require('verror');
var xsenv = require('@sap/xsenv');
var utils = require('../utils');

exports.defineDestinationProviderFunction = defineDestinationProviderFunction;
exports.createDestinationProviderFunction = createDestinationProviderFunction;

/**
 * @param readServiceFunction - synchronous CF service read function accepting
 * one argument the service name and returning the service details
 * @returns {Function}
 */
function createDestinationProviderFunction(readServiceFunction) {
  assert(_.isFunction(readServiceFunction),
      'Valid service reader function should be provided');

  return function getDestination(packagename, objectname, dtDescriptor) {
    var destinationName = utils.toXSObjectId(packagename, objectname);
    assert(destinationName,
        'Valid destination packagename or objectname should be provided');

    var rtDestination = readServiceFunction(destinationName);

    if (!rtDestination) {
      throw new VError(
          'Configuration was not found for destination with name "%s"',
          destinationName);
    }

    if (!dtDescriptor) {
      return rtDestination;
    }

    return _.extend({}, dtDescriptor, rtDestination);
  };
}

function defineDestinationProviderFunction(rt) {
  assert(rt && rt.get, 'Valid runtime object should be provided');
  var customProvider = rt.get('destinationProvider');
  return (customProvider) ?
      customProvider :
      createDestinationProviderFunction(readService);
}

function readService(serviceName) {
  var services = xsenv.filterCFServices(serviceName);
  if (services.length > 0) {
    return services[0].credentials;
  }
  return;
}
