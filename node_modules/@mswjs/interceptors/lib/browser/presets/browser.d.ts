import { FetchInterceptor } from '../interceptors/fetch/index.js';
import { XMLHttpRequestInterceptor } from '../interceptors/XMLHttpRequest/index.js';
import '../Interceptor-8d5fd4c6.js';
import '@open-draft/deferred-promise';
import '@open-draft/logger';
import 'strict-event-emitter';

/**
 * The default preset provisions the interception of requests
 * regardless of their type (fetch/XMLHttpRequest).
 */
declare const _default: readonly [FetchInterceptor, XMLHttpRequestInterceptor];

export { _default as default };
