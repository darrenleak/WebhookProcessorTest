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
      await handler()
      await this.sleep(timeout)
    }
  }
}

class NotificationCenter {
  topicMessages = {}
  topicListenerMap = {}
  knownUrls = {}
  processRequestQueue = []
  busyProcessing = false

  constructor(publisher) {
    console.log('Init NotificationCenter')
    this.publisher = publisher
  }

  getListenersForTopic(topic) {
    if (this.topicListenerMap[topic] === undefined) {
      return `No listeners for ${topic}`
    }

    return this.topicListenerMap[topic]
  }

  getAllTopics() {
    return Object.keys(this.topicListenerMap)
  }

  getAllMessages() {
    return this.topicMessages
  }

  async processMessages(timeout = 0) {
    this.busyProcessing = true
    const topics = Object.keys(this.topicMessages)

    for (const topic of topics) {
      for (const message of this.topicMessages[topic]) {
        const listeners = this.topicListenerMap[topic]

        for (const listener of listeners) {
          const messagesToSend = this.topicMessages[topic].splice(
            0, 
            5
          )
          const bulk = []

          for (const messageToSend of messagesToSend) {
            bulk.push(this.publisher.publish(
              listener,
              messageToSend
            ))
          }

          await Promise.all(bulk)
        }
      }
    }
    
    this.busyProcessing = false 

    if (this.processRequestQueue.length > 0) {
      this.processRequestQueue = []
      this.processMessages()
    }
  }

  async receivedMessage(messageId, url) {}

  requestMessageProcess() {
    this.processRequestQueue.push(1)

    if (!this.busyProcessing) {
      this.processMessages()
    }
  }

  async addMessage(message, topic) {
    if (this.topicMessages[topic] === undefined) {
      this.topicMessages[topic] = []
    }

    this.topicMessages[topic].push(message)

    this.requestMessageProcess()
  }

  addListenerForTopic(listenerUrl, topic) {
    if (this.topicListenerMap[topic] === undefined) {
      this.topicListenerMap[topic] = []
    }

    if (this.knownUrls[listenerUrl] === undefined) {
      this.knownUrls[listenerUrl] = topic
    } else {
      return {
        message: `${listenerUrl} is already subscribed to %{topic}`
      }
    }

    this.topicListenerMap[topic].push(listenerUrl)

    return {
      message: `${listenerUrl} subscribed to ${topic}`
    }
  }

  reset() {
    this.topicMessages = {}
    this.topicListenerMap = {}
    this.knownUrls = {}
  }
}

function createNotificationCenter(publisher) {
  const instance = new NotificationCenter(publisher)
  return instance
}

module.exports = {
  NotificationCenter,
  createNotificationCenter
}
