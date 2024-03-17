// src/utils/uuid.ts
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}

// src/utils/RequestController.ts
import { invariant } from "outvariant";
import { DeferredPromise } from "@open-draft/deferred-promise";
var RequestController = class {
  constructor(request) {
    this.request = request;
    this.responsePromise = new DeferredPromise();
  }
  respondWith(response) {
    invariant(
      this.responsePromise.state === "pending",
      'Failed to respond to "%s %s" request: the "request" event has already been responded to.',
      this.request.method,
      this.request.url
    );
    this.responsePromise.resolve(response);
  }
};

// src/utils/toInteractiveRequest.ts
function toInteractiveRequest(request) {
  const requestController = new RequestController(request);
  Reflect.set(
    request,
    "respondWith",
    requestController.respondWith.bind(requestController)
  );
  return {
    interactiveRequest: request,
    requestController
  };
}

// src/utils/emitAsync.ts
async function emitAsync(emitter, eventName, ...data) {
  const listners = emitter.listeners(eventName);
  if (listners.length === 0) {
    return;
  }
  for (const listener of listners) {
    await listener.apply(emitter, data);
  }
}

export {
  uuidv4,
  toInteractiveRequest,
  emitAsync
};
//# sourceMappingURL=chunk-72HT65NX.mjs.map