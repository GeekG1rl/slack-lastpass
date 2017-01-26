const AWS = require('aws-sdk')

exports.handler = (event, context, callback) => {
  const pass = event.body.split('&').find((section) => section.startsWith('text='))
  const decodePass = decodeURIComponent(pass.split('=')[1]).replace(/\+/g, ' ')
  const response = {
    statusCode: 200,
    body: decodePass
  }

  getFromLambda('konencryptapi_LambdaKeyService', `{}`, (err, data) => {
    const res = (err) ? { value: err.message } : JSON.parse(data.Payload)
    console.log(res)

    getFromLambda('konencryptapi_LambdaEncryptService',
                  `{'key':'${res.id}',
                  'type':'ENCRYPT',
                  'value':'value to be encrypted'}`, (err, data) => {
                    console.log('here')
                    const res = (err) ? { value: err.message } : JSON.parse(data.Payload)
                    console.log(res)
                  })

    callback(null, response)
  })

  function getFromLambda (functionName, payloadData, callback) {
    const credentials = new AWS.SharedIniFileCredentials({profile: 'maraskey-d'})
    AWS.config.credentials = credentials
    const lambda = new AWS.Lambda({
      region: 'eu-west-1'
    })
    const params = {
      FunctionName: functionName,
      Payload: payloadData
    }

    lambda.invoke(params, callback)
  }
}
