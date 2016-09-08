const serialize = require('form-serialize')

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
  document.querySelector('a')
    .addEventListener('click', function (e) {
      e.preventDefault()
      const node = e.target || e.srcElement
      transition(notify, {
        pathname: node.pathname,
        hash: node.hash,
        search: node.search,
        href: node.href
      })
    })
}

function form (document, notify) {
  document.querySelector('form')
    .addEventListener('submit', function (e) {
      e.preventDefault()
      const node = e.target || e.srcElement
      transition({
        action: node.id,
        data: serialize(node, { hash: true })
      })
    })
}
