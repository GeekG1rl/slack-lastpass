const AWS = require('aws-sdk')
const policyInput = require('./helpers/policyInput.js')

exports.handler = (event, context, callback) => {
  // const credentials = new AWS.SharedIniFileCredentials({ profile: 'maraskey-d' })
  // AWS.config.credentials = credentials
  const slackInput = event.body.split('&').find((section) => section.startsWith('text='))
  const decodePass = decodeURIComponent(slackInput.split('=')[1]).replace(/\+/g, ' ')
  const response = {
    statusCode: 200,
    body: decodePass
  }

  getFromLambda('konPolicyGen_KonstructorPolicyGenerator', policyInput, (err, data) => {
    const policyRes = (err) ? { value: err.message } : JSON.parse(data.Payload)
    console.log(policyRes)
    const encryptInput = (new Buffer(JSON.stringify(policyRes)).toString('base64'))
    getFromLambda('konencryptapi_LambdaKeyService', `{}`, (err, data) => {
      const keyRes = (err) ? { value: err.message } : JSON.parse(data.Payload)
      console.log(keyRes.id)
      getFromLambda(
      'konencryptapi_LambdaEncryptService',
      `{"key":"${keyRes.id}",
      "type":"ENCRYPT",
      "value":"${encryptInput}"}`, (err, data) => {
        const encryptRes = (err) ? { value: err.message } : JSON.parse(data.Payload)
        const dynamoDB = new AWS.DynamoDB({
          region: 'eu-west-1'
        })
        const params = {
          Item: {
            'id': {
              S: keyRes.id
            },
            'value': {
              S: encryptRes.value
            }
          },
          TableName: 'maraskey_policy'
        }
        dynamoDB.putItem(params, function (err, data) {
          if (err) console.log(err, err.stack)
          else {
            console.log('Success', response)
          }
          callback(null, response)
        })
      })
    })
  })

  function getFromLambda (functionName, payloadData, callback) {
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
