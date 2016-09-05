# Palmetto

Palmetto is a front-end library for building native web applications using virtual-dom and pull-stream.

It is all about components and services.

## Motivation

To simplify the building of native web applications

## Usage

```
var app = require('palmetto')

app(
  components,
  services,
  document.body
)
```

Palmetto will listen on the document for link clicks, button clicks and form submit events. Then will bundle them up into actions to be notified to the
services pipeline. It is preferred to use hyperlinks to transition from one view to another. Then use buttons for internal interactions within the view and
form submits to post data to your service.

## API

The api is a function that takes a component(s), [service(s)], [target].

The components argument is a nested set of components with a basic signature.

The services optional argument is a `through` pull-stream.

The target optional argument is a document element you want to apply your components to.

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
Events ------> Services --------> Components  ---------->|
^                                                        |
|                                                        |
|----------------<----------------------<----------------|
```


** Services just have to be a through stream(s) for pull-stream. The simplest
through stream for pull-stream is pull-through

```
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
