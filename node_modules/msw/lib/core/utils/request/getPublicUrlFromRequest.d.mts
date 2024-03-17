/**
 * Returns a relative URL if the given request URL is relative to the current origin.
 * Otherwise returns an absolute URL.
 */
declare function getPublicUrlFromRequest(request: Request): string;

export { getPublicUrlFromRequest };
