import { Emitter } from 'strict-event-emitter';
import { f as InteractiveRequest, H as HttpRequestEventMap, e as Interceptor } from '../../Interceptor-7a701c1f.js';
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
