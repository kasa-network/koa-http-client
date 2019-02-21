<div align="center">
  <h1>@kasa/koa-http-client</h1>
</div>

<p align="center">
  A middleware that attachs HTTP client to communicate with the context during inter-service communications in Koa.
</p>

<div align="center">
  <a href="https://circleci.com/gh/kasa-network/koa-http-client">
    <img alt="CircleCI" src="https://circleci.com/gh/kasa-network/koa-http-client.svg?style=shield" />
  </a>
  <a href="https://coveralls.io/github/kasa-network/koa-http-client">
    <img src="https://coveralls.io/repos/github/kasa-network/koa-http-client/badge.svg" alt='Coverage Status' />
  </a>
  <a href="https://badge.fury.io/js/@kasa/koa-http-client">
    <img alt="npm version" src="https://img.shields.io/npm/v/@kasa/koa-http-client.svg" />
  </a>
  <a href="https://david-dm.org/kasa-network/koa-http-client">
    <img alt="npm" src="https://img.shields.io/david/kasa-network/koa-http-client.svg?style=flat-square" />
  </a>
  <a href="https://opensource.org/licenses/mit-license.php">
    <img alt="MIT Licence" src="https://badges.frapsoft.com/os/mit/mit.svg?v=103" />
  </a>
  <a href="https://github.com/ellerbrock/open-source-badge/">
    <img alt="Open Source Love" src="https://badges.frapsoft.com/os/v1/open-source.svg?v=103" />
  </a>
</div>

<br />


## Installation

```bash
# Using NPM
$ npm install --save @kasa/koa-http-client
# Using Yarn
$ yarn add @kasa/koa-http-client
```


### Dependencies

- [**Koa**](https://github.com/koajs/koa) 2.0+
- [**Node.js**](https://nodejs.org) 8.0.0+


## Usage

Use `koa-http-client` as a middleware for a [koa](https://github.com/koajs/koa) app.

```node
const Koa = require('koa');
const requestId = require('@kasa/koa-http-client');
const httpClient = require('@kasa/koa-http-client');
const app = new Koa();

app.use(requestId());
app.use(httpClient({}));
app.use(async ctx => {
  ctx.body = ctx.state.reqId;
});

app.listen(3000);
```


## API

### Creating an middleware

You can create a new http client middleware by passing the relevant options to `httpClient`;

```node
const middleware = httpClient({
  forwardedHeaders: ['Accept-Language'],
  userAgent: 'user-service/0.1.0',
  requestIdHeader: 'X-Service-Request-Id',
  timeout: 20 * 1000,
  retry: 3,
});
```

### Middleware Configuration

These are the available config options for the middleware. All is optional. The middleware attachs HTTP client with the context for each request.

```node
{
  // HTTP headers to forward from Koa `ctx`
  forwardedHeaders: ['Accept-Language', 'Authorization'],

  // Client name to set `User-Agent` header
  userAgent: 'user-service/0.1.0',

  // HTTP header to get/set the request id
  requestIdHeader: 'X-Service-Request-Id',

  // Milliseconds to wait for the server to end the response before aborting the request
  timeout: 20 * 1000,

  // Count to retry on the request errors
  retry: 3,
}
```


## Contributing

#### Bug Reports & Feature Requests

Please use the [issue tracker](https://github.com/kasa-network/koa-http-client/issues) to report any bugs or ask feature requests.


## License

Provided under the terms of the [MIT License](https://github.com/kasa-network/koa-http-client/blob/master/LICENSE).

Copyright © 2019, [Kasa](http://www.kasa.network).
