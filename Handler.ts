import * as http from "cloud-http"

export type Handler = (request: http.Request) => Promise<http.Response.Like | any>
