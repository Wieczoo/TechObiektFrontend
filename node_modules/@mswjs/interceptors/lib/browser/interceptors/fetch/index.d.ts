import { I as Interceptor, H as HttpRequestEventMap } from '../../Interceptor-8d5fd4c6.js';
import '@open-draft/deferred-promise';
import '@open-draft/logger';
import 'strict-event-emitter';

declare class FetchInterceptor extends Interceptor<HttpRequestEventMap> {
    static symbol: symbol;
    constructor();
    protected checkEnvironment(): boolean;
    protected setup(): void;
}

export { FetchInterceptor };
