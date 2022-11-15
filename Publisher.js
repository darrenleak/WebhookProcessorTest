const http = require('http')
const URL = require('url')

const defaultOptions = {
  method: 'POST'
}

class Publisher {
  requestOptions = {}

  constructor(requestOptions = defaultOptions) {
    console.log('Init Publisher')
    this.requestOptions = requestOptions
  }

  async publish(urlString, message) {
    return new Promise((resolve, reject) => {
      const url = URL.parse(urlString)

      const _requestOptions = {
        hostname: url.hostname,
        path: url.path,
        port: url.port,
        method: this.requestOptions.method,
      }

      const data = []
      const request = http.request(_requestOptions, response => {
        response.on('data', responseData => {
          data.push(responseData)
        })
      })

      request.on('error', error => {
        reject(error)
      })
      
      request.write(JSON.stringify(message))
      request.end(() => {
        resolve(data)
        request.destroy()
      })
    })
  }
}

module.exports = Publisher
