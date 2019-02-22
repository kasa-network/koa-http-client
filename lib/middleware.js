'use strict';

const got = require('got');
const debug = require('debug')('koa:http-client');
const pkg = require('../package.json');


/**
 * Return middleware that attachs a HTTP client with Koa context
 * data `ctx` for each request.
 *
 * @param {Object} [options={}] - Optional configuration.
 * @param {string[]} [options.forwardedHeaders] - HTTP headers to forward from Koa `ctx`.
 * @param {string} [options.userAgent] - Client name to set `User-Agent` header.
 * @param {string} [options.requestIdHeader] - HTTP header to get/set the request id.
 * @param {number} [options.timeout] - Milliseconds to wait for the server to end the response before aborting the request.
 * @param {number} [options.retry] - Count to retry on the request errors.
 * @param {boolean} [options.resolveBodyOnly] - Resolve body only instead of `Response` object if true.
 * @return {function} Koa middleware.
 */
module.exports = (options = {}) => {
  const {
    forwardedHeaders = ['Accept-Language'],
    userAgent = `${pkg.name}/${pkg.version}`,
    requestIdHeader = 'X-Request-Id',
    timeout = 30 * 1000,
    retry = 2,
    // TODO: `resolveBodyOnly` will be introduced in next version
    // resolveBodyOnly = true
  } = options;

  debug('Create a middleware');

  return async function httpClient(ctx, next) {
    const headers = {};

    for (const headerName of forwardedHeaders) {
      debug(`check headers['${headerName}'] to forward`);

      const header = ctx.get(headerName);
      if (header) {
        headers[headerName] = header;
        debug(`set headers['${headerName}']=${header}`);
      }
    }

    // Try to get the request id
    const reqId = ctx.id
      || ctx.state.reqId
      || ctx.req.id
      || ctx.request.id
      || ctx.reqId
      || ctx.get(requestIdHeader);

    if (reqId) {
      debug(`reqId=${reqId}`);
      headers[requestIdHeader] = reqId;
    }

    debug(`userAgent=${userAgent}`);
    headers['User-Agent'] = userAgent;

    // Attach http client to Koa `ctx` object
    ctx.http = got.extend({
      json: true,
      // responseType: 'json',
      // resolveBodyOnly,
      timeout,
      retry,
      headers
    });

    // Remove http client to mitigate accidental leaks
    ctx.res.on('finish', () => {
      debug('Remove http client for this context');
      delete ctx.http;
    });

    await next();
  };
};
