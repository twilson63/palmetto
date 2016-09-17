// toState module
//
// is a module that takes a object with a pathname and search attribute
// and creates a palmetto state object
//
var R = require('ramda')
var qs = require('querystring')

// var location = {
//   pathname: '/foo/bar/baz',
//   search: '?foo=bar&baz=beep'
// }

const getState = R.compose(
  R.zipObj(['type', 'action', 'id']),
  R.tail,
  R.split('/'),
  R.prop('pathname')
)

const getProperties = R.compose(
  qs.parse,
  R.head,
  R.tail,
  R.split('?'),
  R.prop('search')
)

module.exports = location => R.set(
  R.lensProp('properties'), 
  getProperties(location),
  getState(location)
)
