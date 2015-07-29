"use strict";

const $ = require('..');
const _ = require('lodash');
const co = require('co');

co(function *() {
  let result = yield $.randomString(48);
  console.log(result);
});
