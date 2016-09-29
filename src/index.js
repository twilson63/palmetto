const update = require('morphdom')
const emitter = require('emitonoff')()

var app = module.exports = function ({ events, services, components, target }) {
  target = target || document.body.querySelector('div')
  // pass notify handler to events module
  events(function (event) {
    emitter.emit('event', event)
  })

  // handle update events
  emitter.on('update', function (node) {
    // need to update dom
    update(target, node)
  })

  // on event get state from services
  var state = {}
  emitter.on('event', function (event) {
    services({state, event}, function (err, newState) {
      state = newState

      if (err) {
        console.log(err.message)
        state = {
          type: 'error',
          data: { message: err.message }
        }
        emitter.emit('render', state)
        return
      }

      emitter.emit('render', state)
    })
  })

  // on render event get node from components
  emitter.on('render', function (state) {
    // need to manage pushState
    window.history.pushState(null, '', toHref(state))
    emitter.emit('update', components(state))
  })
}

function toHref (state) {
  var result = []
  if (state.type) { result.push(state.type) }
  if (state.action) { result.push(state.action) }
  if (state.id) { result.push(state.id) }
  return '/' + result.join('/')
}

app.hx = require('./hx')
