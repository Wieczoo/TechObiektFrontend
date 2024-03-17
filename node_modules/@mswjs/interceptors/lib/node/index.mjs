import {
  BatchInterceptor
} from "./chunk-6ZZBHB3P.mjs";
import {
  decodeBuffer,
  encodeBuffer
} from "./chunk-6HYIRFX2.mjs";
import {
  isResponseWithoutBody
} from "./chunk-IBYBTTYK.mjs";
import {
  IS_PATCHED_MODULE
} from "./chunk-HAGW22AN.mjs";
import {
  Interceptor,
  InterceptorReadyState,
  deleteGlobalSymbol,
  getGlobalSymbol
} from "./chunk-SGO3INLV.mjs";

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