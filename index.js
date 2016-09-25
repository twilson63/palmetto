'use strict';

var through = require('pull-through');
var Notify = require('pull-notify');

var domStream = require('vdom-render-pull-stream');

var pull = require('pull-stream/pull');

var notify = Notify();
var tap = require('./tap');
var toState = require('./to-state');
var toHref = require('./to-href');

var hx = require('./hx');

var app;

app = module.exports = function (_ref) {
  var selectors = _ref.selectors;
  var services = _ref.services;
  var components = _ref.components;
  var target = _ref.target;

  if (!components) {
    throw new Error('components is required!');
  }

  if (!services) {
    services = through(function (data) {
      console.log(data);
      this.queue(data);
    });
  }

  if (!target) {
    target = document.body;
  }

  pull(
  // listen for events
  notify.listen(), services, tap, domStream(function (state) {
    // update url
    window.history.pushState(null, '', toHref(state));
    // generate dom
    return components(state);
  }, target));

  // init selectors
  if (selectors) {
    selectors(notify);
  }
  // handle popstate
  window.addEventListener('popstate', function (e) {
    e.preventDefault();
    notify(toState(window.location));
  });

  // start app
  notify(toState(window.location));
};

app.hx = hx;

app.selectors = function () {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (notify) {
    return fns.map(function (fn) {
      return fn.call(null, notify);
    });
  };
};