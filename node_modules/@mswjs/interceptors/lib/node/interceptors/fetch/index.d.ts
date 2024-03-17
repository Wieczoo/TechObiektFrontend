import { e as Interceptor, H as HttpRequestEventMap } from '../../Interceptor-7a701c1f.js';
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
