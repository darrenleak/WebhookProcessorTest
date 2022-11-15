const { Air } = require('./Air')
const air = new Air(4000)

const endpoint = {
  path: 'blackhole',
  handler: (request, response) => {}
}

let count = 0


class MessageProcessor {
  async sleep(timeout) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, timeout)
    })
  }

  async run(handler, timeout) {
    while (true) {
      handler()
      await this.sleep(timeout)
    }
  }
}

const ms = new MessageProcessor()
ms.run(() => {
  console.log(count)
}, 5000)

air.post(endpoint.path, (request, response) => {
  if (endpoint.handler) {
    endpoint.handler(request, response)
  }

  count += 1

  response.send(
    200,
    {},
    JSON.stringify('')
  )
})

air.serve()
