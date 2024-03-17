"use strict";Object.defineProperty(exports, "__esModule", {value: true});



var _chunkOJ2CN4LSjs = require('./chunk-OJ2CN4LS.js');






var _chunk3O7223NMjs = require('./chunk-3O7223NM.js');

// src/BatchInterceptor.ts
var BatchInterceptor = class extends _chunk3O7223NMjs.Interceptor {
  constructor(options) {
    BatchInterceptor.symbol = Symbol(options.name);
    super(BatchInterceptor.symbol);
    this.interceptors = options.interceptors;
  }
  setup() {
    const logger = this.logger.extend("setup");
    logger.info("applying all %d interceptors...", this.interceptors.length);
    for (const interceptor of this.interceptors) {
      logger.info('applying "%s" interceptor...', interceptor.constructor.name);
      interceptor.apply();
      logger.info("adding interceptor dispose subscription");
      this.subscriptions.push(() => interceptor.dispose());
    }
  }
  on(event, listener) {
    for (const interceptor of this.interceptors) {
      interceptor.on(event, listener);
    }
    return this;
  }
  once(event, listener) {
    for (const interceptor of this.interceptors) {
      interceptor.once(event, listener);
    }
    return this;
  }
  off(event, listener) {
    for (const interceptor of this.interceptors) {
      interceptor.off(event, listener);
    }
    return this;
  }
  removeAllListeners(event) {
    for (const interceptors of this.interceptors) {
      interceptors.removeAllListeners(event);
    }
    return this;
  }
};

// src/utils/getCleanUrl.ts
function getCleanUrl(url, isAbsolute = true) {
  return [isAbsolute && url.origin, url.pathname].filter(Boolean).join("");
}











exports.BatchInterceptor = BatchInterceptor; exports.IS_PATCHED_MODULE = _chunk3O7223NMjs.IS_PATCHED_MODULE; exports.Interceptor = _chunk3O7223NMjs.Interceptor; exports.InterceptorReadyState = _chunk3O7223NMjs.InterceptorReadyState; exports.decodeBuffer = _chunkOJ2CN4LSjs.decodeBuffer; exports.deleteGlobalSymbol = _chunk3O7223NMjs.deleteGlobalSymbol; exports.encodeBuffer = _chunkOJ2CN4LSjs.encodeBuffer; exports.getCleanUrl = getCleanUrl; exports.getGlobalSymbol = _chunk3O7223NMjs.getGlobalSymbol; exports.isResponseWithoutBody = _chunkOJ2CN4LSjs.isResponseWithoutBody;
//# sourceMappingURL=index.js.map