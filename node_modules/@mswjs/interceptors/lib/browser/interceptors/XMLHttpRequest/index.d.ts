import { Emitter } from 'strict-event-emitter';
import { f as InteractiveRequest, H as HttpRequestEventMap, I as Interceptor } from '../../Interceptor-8d5fd4c6.js';
import '@open-draft/deferred-promise';
import '@open-draft/logger';

type XMLHttpRequestEventListener = (args: {
    request: InteractiveRequest;
    requestId: string;
}) => Promise<void> | void;
type XMLHttpRequestEmitter = Emitter<HttpRequestEventMap>;
declare class XMLHttpRequestInterceptor extends Interceptor<HttpRequestEventMap> {
    static interceptorSymbol: symbol;
    constructor();
    protected checkEnvironment(): boolean;
    protected setup(): void;
}

export { XMLHttpRequestEmitter, XMLHttpRequestEventListener, XMLHttpRequestInterceptor };
