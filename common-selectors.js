'use strict';

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

function a(document, notify) {
  var isA = compose(equals('A'), prop('tagName'));
  var getAnchorNode = ifElse(isA, identity, prop('parentNode'));

  most.fromEvent('click', document)
  //.map(e => e.target || e.srcElement)
  .filter(function (e) {
    var node = or(prop('target', e), prop('srcElement', e));
    return ~[node.tagName, node.parentNode.tagName].indexOf('A');
  }).tap(function (e) {
    return e.preventDefault();
  }).map(function (e) {
    return or(prop('target', e), prop('srcElement', e));
  }).map(getAnchorNode).debounce(200).observe(function (a) {
    return transition(notify, {
      pathname: a.pathname,
      hash: a.hash,
      search: a.search,
      href: a.href
    });
  });
}

function button(document, notify) {
  most.fromEvent('click', document).filter(function (e) {
    var node = or(prop('target', e), prop('srcElement', e));
    return ~[node.tagName, node.parentNode.tagName].indexOf('BUTTON');
  }).map(function (e) {
    return or(prop('target', e), prop('srcElement', e));
  }).filter(compose(isNil, prop('form'))).debounce(200).observe(function (button) {
    return transition(notify, {
      action: button.id
    });
  });
}

function form(document, notify) {
  most.fromEvent('submit', document).tap(function (e) {
    return e.preventDefault();
  }).map(function (e) {
    return or(prop('target', e), prop('srcElement', e));
  }).debounce(200).observe(function (form) {
    return transition(notify, {
      action: form.id,
      data: serialize(form, { hash: true })
    });
  });
}