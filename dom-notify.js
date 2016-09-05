var serialize = require('form-serialize')
module.exports = notify => {
  function transition(msg) {
    var state = JSON.parse(window.sessionStorage.getItem('palmetto-state'))
    state.leaving = true
    notify(state)
    setTimeout(_ => notify(msg), 500)
  }
  // handle links
  window.addEventListener('click', e => {
    var node = e.srcElement
    if (node.tagName !== 'A' || node.tagName !== 'BUTTON') {
      if (node.parentNode.tagName === 'A') {
        node = node.parentNode
      }
    }

    if (node.tagName !== 'BUTTON') {
      e.preventDefault()
      transition({
        pathname: node.pathname,
        hash: node.hash,
        search: node.search,
        href: node.href
      })
    }
    // handle button clicks
    if (node.tagName === 'BUTTON' && node.form === null) {
      notify({
        action: node.id
      })
    }
  })
  // handle submit
  window.addEventListener('submit', e => {
    var node = e.srcElement
    e.preventDefault()
    transition({
      action: node.id,
      data: serialize(node, { hash: true })
    })
  })

  // handle popstate
  window.addEventListener('popstate', e => {
    transition({
      pathname: window.location.pathname,
      hash: window.location.hash,
      search: window.location.search,
      href: window.location.href
    })
  })

}
