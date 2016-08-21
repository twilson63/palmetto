var h = require('virtual-dom/h')
const hx = require('hyperx')(h)

var through = require('pull-through')
var Notify = require('pull-notify')

var domStream = require('vdom-render-pull-stream')

var pull = require('pull-stream/pull')

var notify = Notify()


module.exports = function (components, services, target) {
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

  var domNotify = require('./dom-notify')(notify)

  var render = components(hx, notify)

  pull(
    // listen for events
    notify.listen(),

    services,

    domStream(function (state) {
      // update url
      if(state.href) window.history.pushState(null, '', state.href)
      // generate dom
      return render(state)
    }, document.body)
  )

  // start app
  notify(window.location)
}
