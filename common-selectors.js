'use strict';

var document = require('global/document');
var serialize = require('form-serialize');
var most = require('most');

var _require = require('ramda');

var or = _require.or;
var prop = _require.prop;
var equals = _require.equals;
var ifElse = _require.ifElse;
var identity = _require.identity;
var compose = _require.compose;
var isNil = _require.isNil;

var toState = require('./to-state');

module.exports = {
  a: a,
  button: button,
  form: form
};

function transition(notify, msg) {
  var state = JSON.parse(window.sessionStorage.getItem('palmetto-state'));
  state.leaving = true;
  notify(state);
  setTimeout(function (_) {
    return notify(msg);
  }, 500);
}

function a(notify) {
  var isA = compose(equals('A'), prop('tagName'));
  var getAnchorNode = ifElse(isA, identity, prop('parentNode'));

  most.fromEvent('click', document).filter(function (e) {
    var node = or(prop('target', e), prop('srcElement', e));
    return ~[node.tagName, node.parentNode.tagName].indexOf('A');
  }).tap(function (e) {
    return e.preventDefault();
  }).map(function (e) {
    return or(prop('target', e), prop('srcElement', e));
  }).map(getAnchorNode).debounce(200).observe(function (a) {
    return transition(notify, toState(a));
  });
}

function button(notify) {
  most.fromEvent('click', document).filter(function (e) {
    var node = or(prop('target', e), prop('srcElement', e));
    return ~[node.tagName, node.parentNode.tagName].indexOf('BUTTON');
  }).map(function (e) {
    return or(prop('target', e), prop('srcElement', e));
  }).filter(compose(isNil, prop('form'))).debounce(200).observe(function (button) {
    return notify({
      type: button['data-type'] || 'button',
      action: button['data-action'] || 'click',
      id: button['data-id'] || null
    });
  });
}

function form(notify) {
  most.fromEvent('submit', document).tap(function (e) {
    return e.preventDefault();
  }).map(function (e) {
    return or(prop('target', e), prop('srcElement', e));
  }).debounce(200).observe(function (form) {
    return transition(notify, {
      type: form['data-type'],
      action: form['data-action'],
      id: form['data-id'] || null,
      properties: serialize(form, { hash: true })
    });
  });
}