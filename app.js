const { Air } = require('./Air')
const { createNotificationCenter } = require('./NotificationCenter')
const Publisher = require('./Publisher')

const air = new Air()
const publisher = new Publisher()
const notificationCenter = createNotificationCenter(publisher)

air.post('register', (request, response) => {
  const body = request.body
  notificationCenter.addListenerForTopic(body.url, body.topic)
  
  response.send(
    response.statusCode, 
    {}, 
    'Hello WORLD'
  )
})

air.post('addMessage', (request, response) => {
  const body = request.body
  notificationCenter.addMessage(body.message, body.topic)
  
  response.send(
    response.statusCode, 
    {}, 
    'ADDED MESSAGE'
  )
})

air.post('getListenersForTopic', (request, response) => {
  const body = request.body
  const listeners = notificationCenter.getListenersForTopic(body.topic)

  response.send(
    response.statusCode, 
    {}, 
    JSON.stringify(listeners.length)
  )
})

air.post('reset', (request, response) => {
  notificationCenter.reset()
  response.send(200, {}, 'DONE')
})


air.get('getAllMessages', (request, response) => {
  if (response.error) {
    response.send(
      response.statusCode, 
      {}, 
      JSON.stringify(response.statusMessage)
    )
  } else {
    response.send(
      response.statusCode, 
      {}, 
      JSON.stringify({
        topics: notificationCenter.getAllMessages()
      })
    )
  }
})

air.get('getAllTopics', (request, response) => {
  if (response.error) {
    response.send(
      response.statusCode, 
      {}, 
      JSON.stringify(response.statusMessage)
    )
  } else {
    response.send(
      response.statusCode, 
      {}, 
      JSON.stringify({
        topics: notificationCenter.getAllTopics()
      })
    )
  }
})

air.serve()
