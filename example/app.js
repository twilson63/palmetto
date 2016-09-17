const app = require('../')
// get common selectors to listen for events
const { a, button, form } = require('../common-selectors')
const hx = require('../hx')

// app takes virtual dom components and selectors.

app({
  selectors: app.selectors(a, button, form),
  components
})

// vdom component.
function components (state) {
  //console.log(state)
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
    <button data-type="foo" data-action="bar">Big Button</button>
    <form data-type="foo" data-action="show" data-id="1">
      <input name="bar">
      <button>Save</button>
    </form>
  </div>
  `
}
