# Palmetto

Palmetto is a front-end library for building native web applications using virtual-dom and pull-stream.

It is all about components and services.

## Motivation

To simplify the building of native web applications

## Usage

```
var app = require('palmetto')
var {a, button, form} = require('palmetto/common-selectors')
app({
  selectors: app.selectors(a, button, form),
  services,
  components,
  document.body
})
```

## API

The api is a function that takes an object that contains the following nodes:

- selectors
- services
- components
- target  

The `selectors` node takes a function that can have one to many selector functions.

```
app({
  selectors: app.selectors(fn1, fn2, fn3)
})
```

A selector function is a function that has a document object and notify function
as input and simply calls the notify function to dispatch actions.

```
module.exports = function (document, notify) {
  document.querySelector('a#foo')
    .addEventListener('click', function (e) {
      e.preventDefault()
      notify({action: 'foo'})
    })
}
```

Palmetto comes with common-selectors that you can choose to use to provide default
notifications to your services and components.

```
var { a, button, form } = require('palmetto/common-selectors')
var app = require('palmetto')

app({
  selectors: app.selectors(a, button, form)
})
```

You also register your selectors using the `app.selectors` function

---

The `components` node is a higher order function that returns a
function that takes a state argument and returns a virtualTree Node.

```
module.exports = function (hx) {
  return function (state) {
    return hx`<h1>Hello World</h1>`
  }
}
```


The `services` optional node is a `through` pull-stream.

- pull-promise https://pull-stream.github.io/#pull-promise
- async-map https://pull-stream.github.io/#async-map

Are some service functions you may want to use.

```
const toPull = require('pull-promise')

pull(
  pull.values([2, 4, 8]),
  toPull.through((v) => Promise.resolve(v * v)),
  pull.log()
)
```


The `target` optional node is a document element you want to apply your components to.

> ** if you want to update the browser url with your notify events make sure you have a `href` node in your notify object
>
> Example
>
> notify(Object.assign({ href: '/'}, {}))

## Components

In palmetto a component is a high order function:

```
module.exports = function (hx, notify) {
  return function (state) {
    return hx`
      <div>
        <h1>Hello World</h1>
      </div>
    `
  }
}
```

The initial function takes hyperx and a notify function.

[hyperx](https://github.com/substack/hyperx)

hyperx is a tagged template virtual dom builder, you can build virtual dom trees using
tagged templates.

[notify](https://github.com/pull-stream/pull-notify)

notify is a source stream for palmetto, it enables an event emitter like functionality, so you can map to events and use the notify method to
initiate a state change.

When using notify, you should always pass a `pathname` and `href` attributes

## Services - optional

Services is where state is formed and passed to your components. Palmetto is built
off of pull-stream which is a minimal pipeable streaming library.

Events are streamed to services which are bascially one or more through streams. Then once state is created it is piped to the virtual-dom which triggers a
render of your components.

```
Selectors ------> Services --------> Components  ---------->|
^                                                        |
|                                                        |
|----------------<----------------------<----------------|
```


** Services just have to be a through stream(s) for pull-stream. The simplest
through stream for pull-stream is pull-through

```

## Developer Setup

This setup is for developers who intend to fix bugs or add more features to palmetto. Use the src directory to make modifications to library then transpile to es5 using `npm run build`

var through = require('pull-through')

module.exports = through( function (data) {
  /*
  do stuff then return state using
  queue method
  */
  this.queue(data)
})
```

## Contributions

Contributions are welcome to fix edge cases and bugs and any improvements to the
library.

## Example

[For a basic example](./example)

```
npm i wzrd -g
wzrd example/app.js --pushstate
```

## LICENSE

MIT
