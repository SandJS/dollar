"use strict";

/**
 * @author Adam Jaso <ajaso@pocketly.com>
 * @author Kevin Smithson <ksmithson@sazze.com>
 *
 * @copyright 2015 Pocketly
 */

var _ = require('lodash');

var $ = require('..');

var tests = {
  roundLatLon: {
    'should round to 2 decimal places': {
      args: ['37.123456789,-122.123456789', 2],
      expected: '37.12,-122.12'
    },
    'should round to 5 decimal places by default': {
      args: ['37.123456789,-122.123456789'],
      expected: '37.12346,-122.12346'
    }
  },
  llSplit: {
    'should invalidate bad arguments': [
      {
        args: [null],
        expected: null
      },
      {
        args: [undefined],
        expected: null
      },
      {
        args: [''],
        expected: null
      },
      {
        args: ['12.345'],
        expected: null
      }
    ],
    'should extract valid latitude and longitude correctly': {
      args: ['37.12345,-122.12345'],
      expected: {lat: 37.12345, lon: -122.12345}
    }
  },
  normalizeString: {
    'should remove all non word and space characters': [
      {
        args: ['akl*)&laksdk:HDSFkljdhsf'],
        expected: 'akllaksdkhdsfkljdhsf'
      },
      {
        args: ['McDonald\'s Restaurant'],
        expected: 'mcdonaldsrestaurant'
      }
    ]
  },
  md5: {
    'should md5 "asdf"': {
      args: ['asdf'],
      expected: '912ec803b2ce49e4a541068d495ab570'
    }
  },
  sha1: {
    'should sha1 "asdf"': {
      args: ['asdf'],
      expected: '3da541559918a808c2402bba5012f6c60b27661c'
    }
  },
  sha256: {
    'should sha256 "asdf"': {
      args: ['asdf'],
      expected: 'f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b'
    }
  },
  base64encode: {
    'should encode "asdf" correctly': {
      args: ['asdf'],
      expected: 'YXNkZg=='
    }
  },
  base64decode: {
    'should decode "asdf" correctly': {
      args: ['YXNkZg=='],
      expected: 'asdf'
    }
  },
  pluralize: {
    'should correctly pluralize': [
      {
        args: [0, 'meter'],
        expected: '0 meters'
      },
      {
        args: [1, 'meter'],
        expected: '1 meter'
      },
      {
        args: [2, 'meter'],
        expected: '2 meters'
      }
    ]
  },
  nl2br: {
    'should replace all new lines with <br>': {
      args: ['asdf\nasdf\nasdf\nasdf\n\n'],
      expected: 'asdf<br>\nasdf<br>\nasdf<br>\nasdf<br>\n<br>\n'
    }
  },
  mkpath: {
    'should make a valid path from two path strings': [
      {
        args: ['/root/', '/mypath'],
        expected: '/root/mypath'
      },
      {
        args: ['/root', '/mypath'],
        expected: '/root/mypath'
      },
      {
        args: ['/root/', 'mypath'],
        expected: '/root/mypath'
      },
      {
        args: ['/root/', 'mypath', 'asdf', 'fdsa'],
        expected: '/root/mypath/asdf/fdsa'
      }
    ]
  },
  snake2camel: {
    'should change snake case to camel case': {
      args: ['my_key_name'],
      expected: 'myKeyName'
    },
    'should change all object keys from snake case to camel case': {
      args: [{key_my: function() {}, my_key_name2: 234, my_key_name3: 'asdf'}],
      expected: {myKeyName2: 234, myKeyName3: 'asdf'}
    },
    'should change all object keys from snake case to camel case including nested objects': {
      args: [{key_my: function() {}, my_key_name2: 234, my_key_name3: 'asdf', this_is_my_key: {xyz_a: 2, abc_d: 'asdf'}}],
      expected: {myKeyName2: 234, myKeyName3: 'asdf', thisIsMyKey: {xyzA: 2, abcD: 'asdf'}}
    },
    'should change all object keys from snake case to camel case including nested arrays of objects': {
      args: [{key_my: function() {}, my_key_name2: 234, my_key_name3: 'asdf', this_is_my_key: [{xyz_a: 2, abc_d: 'asdf'}, {xyz_a: 2, abc_d: 'asdf'}]}],
      expected: {myKeyName2: 234, myKeyName3: 'asdf', thisIsMyKey: [{xyzA: 2, abcD: 'asdf'}, {xyzA: 2, abcD: 'asdf'}]}
    },
    'should change all object keys in the array from snake case to camel case': {
      args: [[{key_my: function() {}, my_key_name2: 234, my_key_name3: 'asdf'}, {key_my: function() {}, my_key_name2: 234, my_key_name3: 'asdf'}]],
      expected: [{myKeyName2: 234, myKeyName3: 'asdf'}, {myKeyName2: 234, myKeyName3: 'asdf'}]
    },
    'should ignore an array of primitives': {
      args: [['abcd', 'efgh']],
      expected: ['abcd', 'efgh']
    },
    'should ignore empty objects': [
      {
        args: [undefined],
        expected: undefined
      },
      {
        args: [null],
        expected: null
      },
      {
        args: [false],
        expected: false
      },
      {
        args: [''],
        expected: ''
      },
      {
        args: [[null]],
        expected: [null]
      },
      {
        args: [[undefined]],
        expected: [undefined]
      },
      {
        args: [{my_key: [undefined]}],
        expected: {myKey: [undefined]}
      }
    ]
  },
  isPrimitive: {
    'should find primitives': [
      { args: [1], expected: true },
      { args: [''], expected: true },
      { args: [true], expected: true },
      { args: [null], expected: true },
      { args: [undefined], expected: true }
    ],
    'should reject non primitives': [
      { args: [{}], expected: false },
      { args: [new Object], expected: false }
    ]
  },
  mergeConfig: {
    'should merge environment namespaced configs properly': {
      args: [{all: {my: 'data'}, test: {my: 'data2'}}],
      expected: {my: 'data2'}
    }
  },
  matches: {
    'should match a single string and pattern': {
      args: ['http://dev:8000/v2/health', /\/v2\/health$/],
      expected: true
    },
    'should match a single string and a group of patterns': {
      args: ['http://dev:8000/v2/health', [/asdf/, /\/v2\/health$/]],
      expected: true
    }
  },
  
  transgress: {
    'should see non-enumerable properties': {
      args: [(() => {
        let obj = {};
        obj.enumerable = true;

        Object.defineProperty(obj, 'nonEnumerable', {
          enumerable: false,
          value: true
        });

        return obj;
      })()],
      expected: {
        enumerable: true,
        nonEnumerable: true
      }
    }
  },

  extractIPv4: {
    'should get the ip address from string': [
      { args: ['the ip is at the end 1.2.3.4'], expected: '1.2.3.4'},
      { args: ['1.2.3.4 at the beginning'], expected: '1.2.3.4'},
      { args: ['in the middle 1.2.3.4 with 2.2.3.5 ip addresses'], expected: '1.2.3.4'}
    ]
  },

  formatCCLast4: {
    'should format cc': [
      { args: ['amex', '1234'], expected: 'XXXX XXXXXX X1234'},
      { args: ['visa', '1234'], expected: 'XXXX XXXX XXXX 1234'}
    ]
  },
  isNumericMap: {
    'should match an object with all numeric keys': {
      args: [{1: 'abc', 2: 'def', '3': 'ghi'}],
      expected: true
    },
    'may match an object with any non numeric keys for a fast check': [{
      args: [{1: '1', 'abc': 2, 3: 3}, true],
      expected: true
    }, {
      args: [{'abc': 1, '2': 2, 3: '3'}, true],
      expected: true
    }],
    'should not match an object with any non numeric keys for a non fast check': {
      args: [{'abc': 1, '2': 2, 3: '3'}, false],
      expected: false
    }
  }
};

var versionTests = {
  gte: buildVersionTest('>=', true, true, false),
  gt: buildVersionTest('>', true, false, false),
  lte: buildVersionTest('<', false, true, true),
  lt: buildVersionTest('<=', false, false, true),
  toString: {
    'should return the original version string': {
      args: ['1.2.3'],
      expected: '1.2.3'
    }
  }
};

function buildVersionTest(sign, gt, eq, lt) {
  var test = {};
  test['should validate that version A ' + sign + ' version B'] = [
    {
      args: ['1.2.3', ['1.2.2']],
      expected: gt
    },
    {
      args: ['1.2.3', ['1.2.3']],
      expected: eq
    },
    {
      args: ['1.2.3', ['1.2.4']],
      expected: lt
    }
  ];
  return test;
}

var deviceTests = {
  getType: {
    'should return the correct type for the given device string': [
      {
        args: ['iPhOnE 6 plus'],
        expected: $.Device.TYPE_IPHONE
      },
      {
        args: ['andRoid; nexus 5'],
        expected: $.Device.TYPE_ANDROID
      },
      {
        args: ['asdf'],
        expected: $.Device.TYPE_UNKNOWN
      },
      {
        args: ['iPaD;%$#@!'],
        expected: $.Device.TYPE_IPAD
      },
      {
        args: ['asdf', 'iphone', '%$#@!'],
        expected: $.Device.TYPE_IPHONE
      }
    ]
  }
};

describe('dollar', function() {

  runTests(tests);

  describe('Device', function() {
    runTests(deviceTests, $.Device);
  });

  describe('Version', function() {

    _.each(versionTests, function(test, funcName) {

      describe(funcName, function() {

        _.each(test, function(params, description) {

          if (_.isArray(params)) {
            _.each(params, function(param) {
              runTest(param, JSON.stringify(param));
            });
          } else {
            runTest(params);
          }

          function runTest(params, args) {
            var obj = params.args.shift();
            params.args = params.args[0];
            it(description + (args ? ' ' + args : ''), function() {
              var verInstance = $.Version(obj);
              var result = verInstance[funcName].apply(verInstance, params.args);
              if (null === result || undefined === result) {
                (params.expected === result).should.be.ok;
              } else {
                result.should.be.eql(params.expected);
              }
            });
          }

        });

      });

    });

  });

});

function runTests(tests, _$) {
  _$ = _$ || $;
  _.each(tests, function(test, funcName) {

    describe(funcName, function() {

      _.each(test, function(params, description) {

        if (_.isArray(params)) {
          _.each(params, function(param) {
            runTest(param, JSON.stringify(param));
          });
        } else {
          runTest(params);
        }

        function runTest(params, args) {
          it(description + (args ? ' ' + args : ''), function() {
            var result = _$[funcName].apply(_$, params.args);
            if (null === result || undefined === result) {
              (params.expected === result).should.be.ok;
            } else {
              result.should.be.eql(params.expected);
            }
          });
        }

      });

    });

  });
}