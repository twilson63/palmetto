var app = require('../')

app(
  function (hx, notify) {
    
    return function render (state) {
      return hx`
      <div>
        <h1 onclick=${onclick}>${state.title || 'Hello World'}</h1>
      </div>
      `
    }

    function onclick () {
      notify({
        pathname: '/',
        href: '/',
        title: 'Beep'
      })
    }
  }
)
