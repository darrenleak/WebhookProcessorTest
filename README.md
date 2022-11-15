# Idea

Out of the box, Koa and Express were significantly slower than using the http module directly. I wanted to build a very simple webhook service that would use the http module but the idea was to try and lose as little performance as possible.

# How to run the app

It should be as simple as:
```
npm install
```

And once everything is installed:
```
node app.js
```

I do have a docker file, but that does not work at the moment. When it did work it was mainly used to simulate slower cpu performance.

# API Endpoints
Method: POST

Endpoint: `/register`

Body:
```
{
	"topic": "hello-world",
	"url": "http://localhost:4000/blackhole"
}
```
---
Method: POST

Endpoint: `/addMessage`

Body:
```
{
	"topic": "hello-world",
	"message": "Hello World hello WORLD"
}
```
---
Method: POST

Endpoint: `/getListenersForTopic`

Body:
```
{
	"topic": "hello-world"
}
```
---
Method: GET 

Endpoint: `/getAllMessages`

# A few notes
There are still issues with this project.

## Outgoing traffic performance
* I have yet to figure out why the outgoing performance is so bad. It slowly builds up to decent performance, but by the time it gets to that, all the webhook messages have been sent.
* There is no error handling of any kind
* This is not something that should be used in production. My "Air" library/framework that is part of this project is super basic and would need a massive amount of work for it to be considered production ready. Having said this, I am tempted to use "Air" in my other projects that I run on my local machine as a super lightweight wrapper around parts of the http module.

# Very basic test results
For a simple `hello world` response server, the http could do about 47k requests per second on my laptop(Apple M1 machine). The current app can handle around 42-44k requests per second of incoming traffic. Outgoing traffic is strange as it seems be build from 500 requests per second, to about 30k requests per second.

I am sure that there is more performance to gain to get closer to the `hello world` performance.