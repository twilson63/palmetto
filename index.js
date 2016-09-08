var h = require('virtual-dom/h')
const hx = require('hyperx')(h)

var through = require('pull-through')
var Notify = require('pull-notify')

var domStream = require('vdom-render-pull-stream')

var pull = require('pull-stream/pull')

var notify = Notify()
var tap = require('./tap')

var app

app = module.exports = function (selectors, services, components, target) {
  if (!selectors) {
    throw new Error('selectos are requires')
  }

  if (!components) {
    throw new Error('components is required!')
  }

  if (!services) {
    services = through(function (data) {
      console.log(data)
      this.queue(data)
    })
  }

  if (!target) { target = document.body }

  var render = components(hx)

  pull(
    // listen for events
    notify.listen(),

    services,
    tap,
    domStream(function (state) {
      // update url
      if(state.href) window.history.pushState(null, '', state.href)
      // generate dom
      return render(state)
    }, target)
  )

  // init selectors
  selectors(document, notify)
  // handle popstate
  window.addEventListener('popstate', e => {
    e.preventDefault()
    notify({
      pathname: window.location.pathname,
      hash: window.location.hash,
      search: window.location.search,
      href: window.location.href
    })
  })

  // start app
  notify(window.location)
}

app.selectors = function (...fns) {
  return function (document, notify) {
    fns.map(fn => fn.call(null, document, notify))
  }
}
