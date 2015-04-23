/**
 * @author Adam Jaso <ajaso@pocketly.com>
 * @copyright 2015 Pocketly
 */

var _ = require('lodash');


module.exports = exports = {};

exports.TYPE_UNKNOWN = 0;
exports.TYPE_IPHONE = 1;
exports.TYPE_IPAD = 2;
exports.TYPE_ANDROID = 3;
exports.TYPE_WEB = 4;

exports.deviceTypes = {};
exports.deviceTypes[exports.TYPE_IPHONE] = 'iphone';
exports.deviceTypes[exports.TYPE_ANDROID] = 'android';
exports.deviceTypes[exports.TYPE_IPAD] = 'ipad';
exports.deviceTypes[exports.TYPE_WEB] = 'web';

exports.getType = function (platformString) {
  if (!arguments.length) {
    return exports.TYPE_UNKNOWN;
  }

  platformString = Array.prototype.slice.call(arguments).join(' ').trim();

  if (!platformString) {
    return exports.TYPE_UNKNOWN;
  }


  for (var type in exports.deviceTypes) {
    if (exports.deviceTypes.hasOwnProperty(type) && -1 !== platformString.toLowerCase().indexOf(exports.deviceTypes[type])) {
      return parseInt(type);
    }
  }

  return exports.TYPE_UNKNOWN;
};