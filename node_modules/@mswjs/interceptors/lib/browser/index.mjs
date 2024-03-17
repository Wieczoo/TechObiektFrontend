import {
  decodeBuffer,
  encodeBuffer,
  isResponseWithoutBody
} from "./chunk-UJZOJSMP.mjs";
import {
  IS_PATCHED_MODULE,
  Interceptor,
  InterceptorReadyState,
  deleteGlobalSymbol,
  getGlobalSymbol
} from "./chunk-WZQN3FMY.mjs";

// src/BatchInterceptor.ts
var BatchInterceptor = class extends Interceptor {
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
export {
  BatchInterceptor,
  IS_PATCHED_MODULE,
  Interceptor,
  InterceptorReadyState,
  decodeBuffer,
  deleteGlobalSymbol,
  encodeBuffer,
  getCleanUrl,
  getGlobalSymbol,
  isResponseWithoutBody
};
//# sourceMappingURL=index.mjs.map