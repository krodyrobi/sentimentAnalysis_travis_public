'use strict';

var assert = require('assert');
var util = require('util');
var runXsFunction = require('./xs-function-runner').runXsFunction;

module.exports = XsJsFunctionRunner;


/**
 * Constructs an objects that can execute functions from given xsjs script.
 *
 * @param {Runtime} xsjs runtime, see lib/runtime.js
 * @param {string} pathToScript path to xsjs script, e.g. /foo/bar.xsjs
 * @param {object} context execution context defining global variables
 */
function XsJsFunctionRunner(runtime, pathToScript, context) {
  assert(runtime && typeof runtime === 'object', 'Valid runtime should be provided');
  assert(typeof pathToScript === 'string', 'Valid path to script should be provided');
  assert(context && typeof context === 'object', 'Valid context should be provided');

  validateScript(runtime, pathToScript);

  this._scriptRunner = createScriptRunner(runtime, pathToScript, context);
}

/**
 * Executes function from the script provided in constructor. Uses {xs-function-runner#runXsFunction}, see this
 * function for more details on how it works.
 *
 * @param functionName
 * @param thisArg
 * @param argsArray
 * @param cb
 */
XsJsFunctionRunner.prototype.run = function(functionName, thisArg, argsArray, cb) {
  runXsFunction(this._scriptRunner, functionName, thisArg, argsArray, cb);
};

function validateScript(runtime, pathToScript) {
  var script = runtime.getScript(pathToScript);
  if (!script) {
    throw new Error(util.format('Script "%s" not found or has errors', pathToScript));
  }
}

function createScriptRunner(runtime, pathToScript, context) {
  return {
    pathToScript: pathToScript,
    runScript: function() {
      return runtime.runXsjs(pathToScript, context);
    }
  };
}
