import { isly } from "isly"
import { Api } from "../Api"
import { Components } from "./Components"
import { Info } from "./Info"
import { Paths } from "./Paths"
import { Tag } from "./Tag"

export interface OpenApi {
	components?: Components
	info: Info
	jsonSchemaDialect?: string
	openapi: string
	paths: Paths
	servers?: { description?: string; url: string }
	tags?: Tag[]
}
export namespace OpenApi {
	export function endpoint(api: Api<any>, path: `/${string}`): Api.Endpoint<any, any, any, any, any, any, any> {
		return {
			title: "OpenApi",
			description: "",
			path,
			method: "GET",
			request: {},
			response: {
				body: isly.any(),
				status: isly.number("value", 200),
			},
			execute: () => {
				return { body: OpenApi.from(api), status: 200 }
			},
		}
	}
	export function from(api: Api<any>): OpenApi {
		const endpoints = api.definition.endpoints.filter(endpoint => endpoint.title !== "OpenApi")
		return {
			info: Info.from(api.definition),
			// jsonSchemaDialect: "https://json-schema.org/draft/2020-12/schema",
			openapi: "3.0.4",
			paths: Paths.from(endpoints),
			components: Components.from(endpoints),
			tags: Tag.from(api.definition.tags),
		}
	}
}
