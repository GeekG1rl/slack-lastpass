const expect = require('chai').expect
const handlerFunction = require('../index.js').handler
const AWS = require('aws-sdk-mock')

AWS.mock('Lambda', 'invoke', (params, callback) => {
  console.log(params)
  if (params.FunctionName === 'konencryptapi_LambdaKeyService') {
    callback(null, { Payload: JSON.stringify({ id: '16c4f99c-dc89-4dff-aea5-50r90036cc0c',
      key: '3b0366a2-d62a-415f-b548-b47562949eba',
      value: 'cdbecfbb-e96e-478d-8eb0-8685196d93b4' }) })
  } else {
    callback(null, { Payload: JSON.stringify({ test: 'I\'m a test' }) })
  }
})

describe('handler', function () {
  this.timeout(10000)
  it('logs the event', function (done) {
    const event = {
      test: 'test',
      body: `token=lHTyVoNsu2UYUIbyj0agjaNMu&team_id=T025C95MN&
    team_domain=financialtimes&channel_id=D3RQKJ873&
    channel_name=directmessage&user_id=U23HUADCK&user_name=mara.wanot&
    command=%2Fmaya&text=PASSING%20CLOUDS&response_url=https%3A%2F%2Fhooks.
    slack.com%2Fcommands%2FT025C95MN%2F129205621687%2F1SPYLomfeNOtdhhdjGtjaIUp`
    }
    const callback = (err, data) => {
      console.log(data)
      expect(data.body).to.equal('PASSING CLOUDS')
      done()
    }
    handlerFunction(event, null, callback)
  })
})
