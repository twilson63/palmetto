# About Palmetto

Palmetto is a concept that trys to separate services from components and really
encourages pure components and putting all business logic in services. It
creates a unidirectional flow using pull-stream and simple pipeline process, very
similar to node-streams. Every service is just a pull stream and can react or modify the state through the pipeline, then the state is passed to the render process
which is all based on a component tree.

Handling notification events is a challenge, we want all events from the dom to
flow through to the notify stream and only create notification messages for the
appropriate elements.

If a Anchor Element is clicked then build the notify message using the href.
If a button Element is clicked build the notify message using the id.

If a form Element is submitted build the notify message using the form data.

If another element is clicked the walk up the tree to find an element with an id or href and notify based on that id.

Maybe it is better to just check if the element has an id or href set. The only problem is nested anchor elements.

The other options is instead of listening to click events for every element, to only listen to click events for the following elements:

a, button, if it is not a an a or button or form submit, then don't notify.

Or create a plugable selector system, then the app author can define one to many selectors that receive the notify source handler. We will recommend the a and button selectors, but empower the app author to create their own.

var {a, button, form} = require('palmetto/selectors')
var components = require('./components')

app(
  app.selectors(
    a,
    button,
    form
  ),
  app.services(
    service1,
    service2
  ),
  components,
  [domTargetElement]  
)


selector signature:

A selector takes a document object and notify object

You can use the document.querySelector('')
to capture events and then the notify function to
emit events

```
module.exports = function (document, notify) {
  document.querySelector('a')
    .addEventListener('click', function (event) {
      event.preventDefault()
      notify(...)
    })
}
```
