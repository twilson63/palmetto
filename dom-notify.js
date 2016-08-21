module.exports = notify => {
  // handle links
  window.addEventListener('click', e => {
    // need to manage external links
    if (e.srcElement.tagName === 'A') {
      if (e.srcElement.host === window.location.host) {
        e.preventDefault()
        notify({
          pathname: e.srcElement.pathname,
          hash: e.srcElement.hash,
          search: e.srcElement.search,
          href: e.srcElement.href
        })
      }
    }
  })

  // handle popstate
  window.addEventListener('popstate', notify)

}
