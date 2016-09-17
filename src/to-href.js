const {compose, values, pick, join } = require('ramda')

const getValues = compose(
  values,
  pick(['type','action', 'id'])
)

module.exports = state => concat(
  '/',
  join('/', getValues(state)),
)
  
