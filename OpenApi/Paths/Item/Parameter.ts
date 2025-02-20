import { Api } from "../../../Api"
import { Schema } from "../../Schema"
import { MediaType } from "./MediaType"

export type Parameter =
	| Parameter.QueryParameter
	| Parameter.HeaderParameter
	| Parameter.PathParameter
	| Parameter.CookieParameter
export namespace Parameter {
	export function from(request: Api.Endpoint.Request.Definition): Parameter[] {
		return Object.entries(request.parameter).map(([key, value]) => ({
			in: "path",
			description: value.description,
			name: key,
			schema: Schema.from(value),
			required: true,
		}))
	}
	interface CommonParameter {
		content?: { [mediaType: string]: MediaType }
		deprecated?: boolean
		description?: string
		example?: any
		examples?: { [key: string]: Example }
		explode?: boolean
		name: string
		required?: boolean
		schema?: Schema
		style?: string
	}
	export interface QueryParameter extends CommonParameter {
		allowEmptyValue?: undefined | boolean
		allowReserved?: undefined | boolean
		in: "query"
	}
	export interface HeaderParameter extends CommonParameter {
		in: "header"
	}
	export interface PathParameter extends CommonParameter {
		in: "path"
		required: true
	}
	export interface CookieParameter extends CommonParameter {
		in: "cookie"
	}
	export type Header = Omit<HeaderParameter, "in" | "name">
	export interface Encoding {
		allowReserved?: boolean
		contentType?: string
		explode?: boolean
		headers?: { [headerName: string]: Header }
		style?: string
	}
	export interface Example {
		description?: string
		externalValue?: string
		summary?: string
		value?: any
	}
}
