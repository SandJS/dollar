/**
 * @author Adam Jaso <ajaso@pocketly.com>
 * @copyright 2015 Pocketly
 */

var _ = require('lodash');
var compareVersion = require('compare-version');
var versionPattern = /^((?:\d+\.*){1,3})\s*\((\d+)\)\s*$/i;

module.exports = exports = Version;

function Version(ver) {
  if (!(this instanceof Version)) {
    return new Version(ver);
  }

  if (!_.isString(ver)) {
    throw new Error('invalid version: ' + ver);
  }

  this.ver = ver;

}

Version.prototype.lt = function(ver2) {
  return compareVersion(this.ver, ver2) < 0;
};

Version.prototype.lte = function(ver2) {
  return compareVersion(this.ver, ver2) <= 0;
};

Version.prototype.gt = function(ver2) {
  return compareVersion(this.ver, ver2) > 0;
};

Version.prototype.gte = function(ver2) {
  return compareVersion(this.ver, ver2) >= 0;
};
Version.prototype.eq = function(ver2) {
  return compareVersion(this.ver, ver2) == 0;
};

Version.prototype.toString = Version.prototype.inspect = function toString() {
  return this.ver;
};

Version.parse = function parse(versionString) {

  var matches = _.isString(versionString) ? versionString.match(versionPattern) || [] : [];

  return {
    version: Version(matches[1] || ''),
    build: matches[2] || 0
  }

};