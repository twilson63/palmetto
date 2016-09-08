const app = require('../')
// get common selectors to listen for events
const { a, button, form } = require('../common-selectors')

// app takes virtual dom components and selectors.

app({
  selectors: app.selectors(a, button, form),
  components
})

// vdom component.
function components (hx) {
  return function render (state) {
    var title = 'Hello World'
    if (state.action === 'clicked') {
      title = 'You Clicked  a Button'
    }
    return hx`
    <div>
      <h1>${title}</h1>
      <a href="/foo">Foo</a>
      <a href="/bar">
        <h1>Big Bar</h1>
      </a>
      <button id="clicked">Big Button</button>
      <form id="foo">
        <input name="bar">
        <button>Save</button>
      </form>
    </div>
    `
  }
}
