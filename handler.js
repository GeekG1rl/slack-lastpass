const winston = require('winston')
module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: event.body
  }
  // log the event so you should see in in the slack response
  const validLog = winston.log('LOG ME', {
    body: event.body
  })

  callback(null, response)

  validLog
}
