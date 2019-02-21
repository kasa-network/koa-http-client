'use strict';

const httpClient = require('../');


// const createContext = () => ({
//   request: {},
//   state: {},
//   get: jest.fn(),
//   set: jest.fn()
// });

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
  });
});
