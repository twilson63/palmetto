var serialize = requrie('form-serialize')
module.exports = notify => {
  // handle links
  window.addEventListener('click', e => {
    // need to manage external links
    if (e.srcElement.tagName === 'A') {
      if (e.srcElement.host === window.location.host) {
        e.preventDefault()
        var state = JSON.parse(window.sessionStorage.getItem('palmetto-state'))
        state.leaving = true
        notify(state)
        setTimeout(_ =>
          notify({
            pathname: e.srcElement.pathname,
            hash: e.srcElement.hash,
            search: e.srcElement.search,
            href: e.srcElement.href
          })
        , 1000)
      }
    }
    // handle button clicks
    if (e.srcElement.tagName === 'button') {
      // handle button clicks
      notify({
        action: e.srcElement.id
      })
    }
  })
  // handle submit
  window.addEventListener('submit', e => {
    e.preventDefault()
    notify({
      action: e.srcElement.id,
      data: serialize(e.srcElement, { hash: true })
    })
  })

  // handle popstate
  window.addEventListener('popstate', notify)

}
