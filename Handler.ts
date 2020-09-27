import { Parameters } from "./Parameters"
export type Handler = (request: Request, parameter?: Parameters) => Promise<Response>
