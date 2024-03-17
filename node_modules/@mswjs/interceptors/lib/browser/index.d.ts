import { I as Interceptor, E as ExtractEventNames } from './Interceptor-8d5fd4c6.js';
export { H as HttpRequestEventMap, a as IS_PATCHED_MODULE, b as InterceptorEventMap, e as InterceptorReadyState, c as InterceptorSubscription, R as RequestCredentials, d as deleteGlobalSymbol, g as getGlobalSymbol } from './Interceptor-8d5fd4c6.js';
import { EventMap, Listener } from 'strict-event-emitter';
import '@open-draft/deferred-promise';
import '@open-draft/logger';

interface BatchInterceptorOptions<InterceptorList extends ReadonlyArray<Interceptor<any>>> {
    name: string;
    interceptors: InterceptorList;
}
type ExtractEventMapType<InterceptorList extends ReadonlyArray<Interceptor<any>>> = InterceptorList extends ReadonlyArray<infer InterceptorType> ? InterceptorType extends Interceptor<infer EventMap> ? EventMap : never : never;
/**
 * A batch interceptor that exposes a single interface
 * to apply and operate with multiple interceptors at once.
 */
declare class BatchInterceptor<InterceptorList extends ReadonlyArray<Interceptor<any>>, Events extends EventMap = ExtractEventMapType<InterceptorList>> extends Interceptor<Events> {
    static symbol: symbol;
    private interceptors;
    constructor(options: BatchInterceptorOptions<InterceptorList>);
    protected setup(): void;
    on<EventName extends ExtractEventNames<Events>>(event: EventName, listener: Listener<Events[EventName]>): this;
    once<EventName extends ExtractEventNames<Events>>(event: EventName, listener: Listener<Events[EventName]>): this;
    off<EventName extends ExtractEventNames<Events>>(event: EventName, listener: Listener<Events[EventName]>): this;
    removeAllListeners<EventName extends ExtractEventNames<Events>>(event?: EventName | undefined): this;
}

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

export { BatchInterceptor, BatchInterceptorOptions, ExtractEventMapType, ExtractEventNames, Interceptor, decodeBuffer, encodeBuffer, getCleanUrl, isResponseWithoutBody };
