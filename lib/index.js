"use strict";

var crypto = require('crypto');
var _ = require('lodash');
var sanitize = require('sanitize')();

var DEFAULT_RESOLUTION = 5;
var normalizeRegex = /[\W\s]+/ig;

module.exports = exports = {

  Version: require('./Version'),
  Device: require('./Device'),

  /**
   * Round 'latitude,longitude' strings to a given number of decimals and return the concatenated string result
   * Example:
   *
   *    roundLatLon('37.12345,-122.12345', 2) == '37.12,-122.12'
   *
   * @param ll csv latitude, longitude string
   * @param resolution number of decimals to round
   * @returns {string}
   */
  roundLatLon: function fixResolution(ll, resolution) {
    var factor = Math.pow(10, resolution || DEFAULT_RESOLUTION);
    var spl = ll.split(',');
    return (Math.round(parseFloat(spl[0]) * factor) / factor) + ',' + (Math.round(parseFloat(spl[1]) * factor) / factor);
  },

  /**
   * Parses latitude and longitude into appropriate float values
   *
   * @param ll csv latitude, longitude string
   * @returns {*}
   */
  llSplit: function(ll) {
    if (!_.isString(ll)) {
      return null;
    }

    var spl = ll.split(',');
    if (spl.length < 2) {
      return null;
    }

    return {
      lat: sanitize.my.float(spl[0]),
      lon: sanitize.my.float(spl[1])
    };
  },

  /**
   * Removes all non word characters and lowercases the given string
   *
   * @param str
   * @returns {string}
   */
  normalizeString: function(str) {
    return str.replace(normalizeRegex, '').toLowerCase()
  },

  /**
   * Shortcut to create an MD5 hash
   *
   * @param {String|Buffer} data - what to hash
   * @param {String=} enc - hash encoding (defaults: hex)
   * @returns {String} MD5 hash string in the given encoding
   */
  md5: function(data, enc) {
    return crypto.createHash('md5').update(data).digest(enc || 'hex');
  },

  /**
   * Shortcut to create an SHA1 hash
   *
   *     mymodule.write('foo')
   *     mymodule.write('foo', { stream: process.stderr })
   *
   * @param {String|Buffer} data - what to hash
   * @param {String} enc - hash encoding
   * @returns {String} SHA1 hash string in the given encoding
   */
  sha1: function(data, enc) {
    return crypto.createHash('sha1').update(data).digest(enc || 'hex');
  },

  /**
   * Shortcut to create an SHA1 hash
   *
   *     mymodule.write('foo')
   *     mymodule.write('foo', { stream: process.stderr })
   *
   * @param {String|Buffer} data - what to hash
   * @param {String} enc - hash encoding
   * @returns {String} SHA1 hash string in the given encoding
   */
  sha256: function(data, enc) {
    return crypto.createHash('sha256').update(data).digest(enc || 'hex');
  },

  /**
   * Returns a base64 encoded string of the given data
   *
   * @param {String} data
   * @returns {String}
   */
  base64encode: function(data) {
    return new Buffer(data).toString('base64');
  },

  /**
   * Accepts a base64 encoded string of the given data and returns its string representation
   *
   * @param {String} data
   * @returns {String}
   */
  base64decode: function(data) {
    return new Buffer(data, 'base64').toString();
  },

  /**
   * Returns the given number with the units attached and in the proper plural or singular case (ex. 1 unit, 2 units, etc.)
   *
   * @param {String|Integer} num
   * @param {String} unit
   * @returns {string}
   */
  pluralize: function(num, unit) {
    return num + ' ' + unit + (parseInt(num) != 1 ? 's' : '');
  },

  /**
   * Inserts HTML <br> tags beside all newlines and returns the result
   *
   * @param {String} str
   * @returns {string}
   */
  nl2br: function(str) {
    var breakTag = '<br>';

    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  },

  /**
   * Generates a randomized encoded string
   *
   * @param {Integer} length - how many random bytes to generate (NOTE: 48 bytes = 64 characters in base64)
   * @param {Function} callback
   * @param {String} enc - the encoding in which to return the string (default: base64)
   * @param {Integer} numTries - how many generate attempts to allow before returning an error (default: 3)
   */
  randomString: function(length, callback, enc, numTries) {
    enc = enc || 'base64';
    numTries = numTries || 3;
    crypto.randomBytes(length, function(err, buf) {
      if (err || numTries == 3) {
        if (numTries > 0) {
          return exports.randomString(length, callback, enc, --numTries);
        } else {
          return callback(err);
        }
      }
      callback(null, buf.toString(enc));
    });
  },

  /**
   * Merges a config with several environments with the correct hierarchy
   *
   * Example:
   *
   *    config[(process.env.NODE_ENV || 'development')] overrides config['all']
   *
   * @param {Object} config
   * @returns {Object} merged config
   */
  mergeConfig: function getConfig(config) {

    config = config || {};
    var envName = process.env.NODE_ENV || 'development';
    var env = config[envName] || {};
    var all = config['all'] || {};

    return _.merge(all, env);
  },

  /**
   * Checks if the given string matches the given pattern(s). Accepts a pattern or an array of patterns
   *
   * @param {String} str
   * @param {RegExp|Array} regex
   * @returns {Boolean} true if a match is found, else false
   */
  matches: function(str, regex) {

    if (!_.isString(str)) {
      return false;
    }

    if (regex instanceof RegExp) {
      return regex.test(str);
    }

    if (_.isArray(regex)) {
      var i = regex.length;
      while(i--) {
        if (regex[i].test(str)) {
          return true;
        }
      }
    }

    return false;
  },

  /**
   * @deprecated this one is already in `path`
   *
   * Join all the arguments as a single path without worrying about leading and trailing slashes
   *
   * @params {String}... as many path segments as you need to join
   *
   * @returns {String} fully joined path
   */
  mkpath: function (dir, rel) {
    let segs = Array.prototype.slice.call(arguments);
    return _.reduce(segs, function(path1, path2) {
      return path1.replace(/\/$/, '') + '/' + path2.replace(/^\//, '')
    });
  },

  /**
   * Converts a snake case string to camel case
   * Converts an object with snake case keys to camel case keys
   * Converts an array of objects with snake case keys to camel case keys
   *
   * @param snake {String|Array|Object}
   * @returns {String|Array|Object}
   */
  snake2camel: function(snake) {

    if (!snake) {
      return snake;
    }

    if (_.isString(snake)) {
      return _snake2camel(snake);

    } else if (_.isArray(snake)) {
      return _snakeArr2camel(snake);

    } else if (_.isObject(snake)) {
      return _snakeObj2camel(snake);
    }

    return null;

    function _snakeArr2camel(snake) {
      if (!snake) {
        return snake;
      }
      return _.map(snake, function(obj) {
        if (exports.isPrimitive(obj)) {
          return _snake2camel(obj);
        } else if (_.isArray(obj)) {
          return _snakeArr2camel(obj);
        } else {
          return _snakeObj2camel(obj);
        }
      });
    }

    function _snakeObj2camel(snake) {
      if (!snake) {
        return snake;
      }
      let values = {};
      _.each(snake, function(val, key) {
        if (!_.isFunction(val)) {
          if (exports.isPrimitive(val)) {
            values[_snake2camel(key)] = val;
          } else if (_.isArray(val)) {
            values[_snake2camel(key)] = _snakeArr2camel(val);
          } else {
            values[_snake2camel(key)] = _snakeObj2camel(val);
          }
        }
      });
      return values;
    }

    function _snake2camel(snake) {
      if (!snake || _.isNumber(snake)) {
        return snake;
      }
      return snake.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
    }
  },

  isPrimitive: function(val) {
    return _.isNumber(val) || _.isBoolean(val) || _.isString(val) || _.isNull(val) || _.isUndefined(val);
  }

};