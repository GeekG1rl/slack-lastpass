const expect = require('chai').expect
const LambdaTester = require('lambda-tester')
const handlerFunction = require('./handler.js').handler

describe('handler', () => {
  it('logs the event', () => {
    return LambdaTester(handlerFunction)
      .event({
        test: 'test',
        body: `token=lHTyVoNs2XYUIbyj0agjaNMu&team_id=T025C95MN&
        team_domain=financialtimes&channel_id=D3RQKK873&
        channel_name=directmessage&user_id=U23HUADCK&user_name=mara.wanot&
        command=%2Fmaya&text=PASSING%20CLOUDS&response_url=https%3A%2F%2Fhooks.
        slack.com%2Fcommands%2FT025C95MN%2F129205621687%2F1SPYLomfeNOtdhhdjGtjaIUp`
      })
      .expectResult(function (result) {
        expect(result.body).to.equal('PASSING CLOUDS')
      })
  })
})
