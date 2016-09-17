var document = require('global/document')
const serialize = require('form-serialize')
const most = require('most')
const { or, prop, equals, ifElse, identity, compose, isNil } = require('ramda')
const toState = require('./to-state')

module.exports = {
  a,
  button,
  form
}

function transition(notify, msg) {
  var state = JSON.parse(window.sessionStorage.getItem('palmetto-state'))
  state.leaving = true
  notify(state)
  setTimeout(_ => notify(msg), 500)
}

function a (notify) {
  const isA = compose(equals('A'), prop('tagName'))
  const getAnchorNode = ifElse(isA, identity, prop('parentNode'))

  most.fromEvent('click', document)
    .filter(e => {
      const node = or(prop('target', e), prop('srcElement', e))
      return ~[node.tagName, node.parentNode.tagName].indexOf('A')
    })
    .tap(e => e.preventDefault())
    .map(e => or(prop('target', e), prop('srcElement', e)))
    .map(getAnchorNode)
    .debounce(200)
    .observe(a => transition(notify, toState(a)))

}

function button (notify) {
  most.fromEvent('click', document)
    .filter(e => {
      const node = or(prop('target', e), prop('srcElement', e))
      return ~[node.tagName, node.parentNode.tagName].indexOf('BUTTON')
    })
    .map(e => or(prop('target', e), prop('srcElement', e)))
    .filter(compose(isNil, prop('form')))
    .debounce(200)
    .observe(button => notify({
      type: button['data-type'] || 'button',
      action: button['data-action'] || 'click',
      id: button['data-id'] || null
    }))
}

function form (notify) {
  most.fromEvent('submit', document)
    .tap(e => e.preventDefault())
    .map(e => or(prop('target', e), prop('srcElement', e)))
    .debounce(200)
    .observe(form => transition(notify, {
      type: form['data-type'],
      action: form['data-action'],
      id: form['data-id'] || null,
      properties: serialize(form, { hash: true })
    }))

}
