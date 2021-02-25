import * as http from "cloud-http"
import { Callback } from "./Callback"

export type Handler = (request: http.Request, callbacks: Callback[]) => Promise<http.Response.Like | any>
