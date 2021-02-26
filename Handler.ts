import * as http from "cloud-http"
import { Context } from "./Context"

export type Handler = (request: http.Request, context: Context) => Promise<http.Response.Like | any>
