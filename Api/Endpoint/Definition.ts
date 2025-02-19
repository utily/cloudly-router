import { http } from "cloudly-http"
import type { Endpoint } from "."
import { Request } from "./Request"
import { Response } from "./Response"

export interface Definition {
	title: string
	description: string
	path: string
	method: http.Method
	request: Endpoint.Request.Definition
	response: Endpoint.Response.Definition
}
export namespace Definition {
	export function from<C extends object>(endpoint: Endpoint<C>): Definition {
		return {
			title: endpoint.title,
			description: endpoint.description,
			path: endpoint.path,
			method: endpoint.method,
			request: Request.Definition.from(endpoint.request),
			response: Response.Definition.from(endpoint.response),
		}
	}
}
