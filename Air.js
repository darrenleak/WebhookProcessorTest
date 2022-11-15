const http = require('http')

/*
 *
 * Add http2 support
 *
 */

const defaultConfig = {
  cluster: {
    maxProcesses: 1
  },
  path: {
    prefix: '/'
  },
  body: {
    useBuffer: false
  }
}

class Air {
  constructor(port = 3000, config = defaultConfig) {
    this.config = config
    this.routes = {}
    this.port = port

    this.server = http.createServer((request, response) => {
      const route = this.routes[request.url] 
      const send = (status, headers, message) => {
        response.writeHead(status, headers)
        response.end(message)
      }
      
      response.send = send
      
      if (route.method !== request.method) {
        response.statusCode = 405
        response.statusMessage = `Incorrect HTTP method, expected ${route.method}`
        response.error = {}
        
        route.callback(request, response)

        return
      } 

      if (route.method === 'GET') {
        response.statusCode = 200
        this.routes[request.url].callback(request, response)
        return
      }

      let body = []

      request.on('data', chunk => {
        body.push(chunk)
      }).on('end', () => {
        if (!this.config.body.useBuffer) { 
          body = JSON.parse(Buffer.concat(body).toString())
        }
        
        response.statusCode = 200

        request.body = body
        route.callback(request, response)
      })
    })
  }

  get(path, callback) {
    const pathPrefix = this.config.path.prefix
    this.routes[`${pathPrefix}${path}`] = {
      callback,
      'method': 'GET'
    }
  }

  post(path, callback) {
    const pathPrefix = this.config.path.prefix
    this.routes[`${pathPrefix}${path}`] = {
      callback,
      'method': 'POST'
    }
  }
  
  patch(path, callback) {
    const pathPrefix = this.config.path.prefix
    this.routes[`${pathPrefix}${path}`] = {
      callback,
      'method': 'PATCH'
    }
  }
  
  put(path, callback) {
    const pathPrefix = this.config.path.prefix
    this.routes[`${pathPrefix}${path}`] = {
      callback,
      'method': 'PUT'
    }
  }

  getRoute(path) {
    return this.routes[path]
  }

  serve() {
    this.server.listen(this.port)
  }
}

module.exports = {
  Air
}
