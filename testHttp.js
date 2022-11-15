const http = require('http')

async function runCall(calls) {
  return new Promise(resolve => {
    const value = JSON.stringify('')
    const _requestOptions = {
      hostname: 'localhost',
      path: '/blackhole',
      port: '4000',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': value.length
      }
    }

    const request = http.request(_requestOptions, async response => {
      response.on('data', () => {})
      response.on('end', () => { 
        resolve()
      })
    })

    request.on('error', error => {
      console.log(error)
    })

    request.write(value)
    request.end()
  })
}

async function main() {
  for (let x = 0; x < 20000; x++) {
    await runCall()
  }
}

main()

