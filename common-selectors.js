const serialize = require('form-serialize')
const most = require('most')
const { or, prop, equals, ifElse, identity, compose, isNil } = require('ramda')

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

function a (document, notify) {
  const isA = compose(equals('A'), prop('tagName'))
  const getAnchorNode = ifElse(isA, identity, prop('parentNode'))

  most.fromEvent('click', document)
    //.map(e => e.target || e.srcElement)
    .filter(e => {
      const node = or(prop('target', e), prop('srcElement', e))
      return ~[node.tagName, node.parentNode.tagName].indexOf('A')
    })
    .tap(e => e.preventDefault())
    .map(e => or(prop('target', e), prop('srcElement', e)))
    .map(getAnchorNode)
    .debounce(200)
    .observe(a => transition(notify, {
      pathname: a.pathname,
      hash: a.hash,
      search: a.search,
      href: a.href
    }))

}

function button (document, notify) {
  most.fromEvent('click', document)
    .filter(e => {
      const node = or(prop('target', e), prop('srcElement', e))
      return ~[node.tagName, node.parentNode.tagName].indexOf('BUTTON')
    })
    .map(e => or(prop('target', e), prop('srcElement', e)))
    .filter(compose(isNil, prop('form')))
    .debounce(200)
    .observe(button => transition(notify, {
      action: button.id
    }))

}

function form (document, notify) {
  most.fromEvent('submit', document)
    .tap(e => e.preventDefault())
    .map(e => or(prop('target', e), prop('srcElement', e)))
    .debounce(200)
    .observe(form => transition(notify, {
      action: form.id,
      data: serialize(form, { hash: true })
    }))

}
