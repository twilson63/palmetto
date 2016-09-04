var through = require('pull-through')

module.exports = through( function (data) {
  // store current state
  window.localStorage.setItem('palmetto-state', JSON.stringify(data))
  this.queue(data)
})
