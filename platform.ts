const PlatformRequest = typeof Request != "undefined" ? Request : globalThis.Request
type PlatformRequest = Request

const PlatformResponse = typeof Response != "undefined" ? Response : globalThis.Response
type PlatformResponse = Response

export { PlatformRequest as Request, PlatformResponse as Response }
