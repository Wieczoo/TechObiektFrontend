export { E as ExtractEventNames, H as HttpRequestEventMap, I as IS_PATCHED_MODULE, e as Interceptor, a as InterceptorEventMap, c as InterceptorReadyState, b as InterceptorSubscription, R as RequestCredentials, d as deleteGlobalSymbol, g as getGlobalSymbol } from './Interceptor-7a701c1f.js';
export { a as BatchInterceptor, B as BatchInterceptorOptions, E as ExtractEventMapType } from './BatchInterceptor-9785c567.js';
import '@open-draft/deferred-promise';
import '@open-draft/logger';
import 'strict-event-emitter';

/**
 * Removes query parameters and hashes from a given URL.
 */
declare function getCleanUrl(url: URL, isAbsolute?: boolean): string;

declare function encodeBuffer(text: string): Uint8Array;
declare function decodeBuffer(buffer: ArrayBuffer, encoding?: string): string;

/**
 * Returns a boolean indicating whether the given response status
 * code represents a response that cannot have a body.
 */
declare function isResponseWithoutBody(status: number): boolean;

export { decodeBuffer, encodeBuffer, getCleanUrl, isResponseWithoutBody };
