exports.handler = (event, context, callback) => {
  const pass = event.body.split('&').find((section) => section.startsWith('text='))
  const decodePass = decodeURIComponent(pass.split('=')[1]).replace(/\+/g, ' ')
  const response = {
    statusCode: 200,
    body: decodePass
  }

  callback(null, response)
}
