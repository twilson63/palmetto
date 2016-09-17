'use strict';

var _require = require('ramda');

var compose = _require.compose;
var values = _require.values;
var pick = _require.pick;
var join = _require.join;


var getValues = compose(values, pick(['type', 'action', 'id']));

module.exports = function (state) {
  return concat('/', join('/', getValues(state)));
};