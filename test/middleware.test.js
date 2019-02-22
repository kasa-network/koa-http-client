'use strict';

const { EventEmitter } = require('events');
const httpClient = require('../');
const pkg = require('../package.json');


const createContext = () => ({
  req: {},
  request: {},
  res: {
    on: jest.fn()
  },
  state: {},
  get: jest.fn(),
  set: jest.fn()
});

describe('http-client', () => {
  let middleware;

  beforeEach(() => {
    middleware = httpClient();
  });

  it('should be defined as function', () => {
    expect(httpClient).toBeDefined();
    expect(httpClient).toBeFunction();
  });

  describe('middleware', () => {
    it('should be defined as koa middleware function', () => {
      expect(middleware).toBeDefined();
      expect(middleware).toBeFunction();
    });

    it('should expose a named function', () => {
      expect(middleware.name).toEqual('httpClient');
    });

    it('should attachs HTTP client into `ctx`', async () => {
      const context = createContext();

      await middleware(context, () => {
        expect(context.http).toBeDefined();
        expect(context.http).toBeFunction();
      });
    });

    it('should attachs HTTP client into `ctx` with default options', async () => {
      const context = createContext();

      await middleware(context, () => {
        const client = context.http;
        const defaultOptions = client.defaults.options;
        const defaultHeaders = defaultOptions.headers;

        expect(defaultOptions.retry.retries).toEqual(2);
        expect(defaultOptions.retry.maxRetryAfter).toEqual(30 * 1000);
        expect(defaultOptions.gotTimeout.request).toEqual(30 * 1000);
        expect(defaultOptions.json).toEqual(true);
        expect(defaultHeaders['user-agent']).toEqual(`${pkg.name}/${pkg.version}`);
      });
    });

    it('should attachs HTTP client into `ctx` with custom options', async () => {
      const middleware = httpClient({
        retry: 5,
        timeout: 10 * 1000,
        userAgent: 'helloworld'
      });
      const context = createContext();

      await middleware(context, () => {
        const client = context.http;
        const defaultOptions = client.defaults.options;
        const defaultHeaders = defaultOptions.headers;

        expect(defaultOptions.retry.retries).toEqual(5);
        expect(defaultOptions.retry.maxRetryAfter).toEqual(10 * 1000);
        expect(defaultOptions.gotTimeout.request).toEqual(10 * 1000);
        expect(defaultOptions.json).toEqual(true);
        expect(defaultHeaders['user-agent']).toEqual('helloworld');
      });
    });

    it('should delete HTTP client when the response `finish` event', async () => {
      const context = createContext();
      context.res = new EventEmitter();

      await middleware(context, () => {
        context.res.emit('finish');
        expect(context.http).toBeUndefined();
      });
    });

    it('should set the request id header if Koa `ctx` have', async () => {
      const context = createContext();
      context.id = 'my-custom-request-id';

      await middleware(context, () => {
        const client = context.http;
        const defaultHeaders = client.defaults.options.headers;

        expect(defaultHeaders['x-request-id']).toEqual(context.id);
      });
    });

    it('should delete HTTP client when the response `finish` event', async () => {
      const middleware = httpClient({
        forwardedHeaders: ['Content-Language', 'My-Custom-Header']
      });
      const context = createContext();
      const headers = new Map();
      headers.set('Content-Language', 'ko-KR');
      headers.set('My-Custom-Header', 'yeah!');
      context.get = (key) => headers.get(key);

      await middleware(context, () => {
        const client = context.http;
        const defaultHeaders = client.defaults.options.headers;

        expect(defaultHeaders['content-language']).toEqual('ko-KR');
        expect(defaultHeaders['my-custom-header']).toEqual('yeah!');
      });
    });
  });
});
