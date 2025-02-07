export namespace schema {
	export interface OpenAPI {
		// components?: undefined | Components
		// externalDocs?: undefined | ExternalDocumentation
		info: Info
		jsonSchemaDialect?: string
		openapi: "3.1.0"
		paths: Paths
		// security?: undefined | SecurityRequirement[]
		servers?: { description?: string; url: string }
		// tags?: undefined | Tag[]
		// webhooks?: undefined | { [webhookName: string]: PathItem | Reference }
	}
	export interface Info {
		// contact?: undefined | Contact
		description?: string
		// license?: License
		summary?: string
		termsOfService?: string
		title: string
		version: string
	}
	export interface Paths {
		[path: string]: Paths.Item
	}
	export namespace Paths {
		export interface Item {
			$ref?: string
			delete?: Operation
			description?: string
			get?: Operation
			head?: Operation
			options?: Operation
			parameters?: Parameter[]
			patch?: Operation
			post?: Operation
			put?: Operation
			// servers?: Server[]
			summary?: string
			trace?: Operation
		}
		export interface Operation {
			// callbacks?: undefined | { [callbackIdentifier: string]: Callback | Reference }
			deprecated?: boolean
			description?: string
			// externalDocs?: undefined | ExternalDocumentation
			operationId?: string
			parameters?: Parameter[]
			requestBody?: RequestBody
			responses?: Responses
			// security?: undefined | Array<SecurityRequirement>
			// servers?: undefined | Array<Server>
			summary?: string
			// tags?: undefined | Array<string>
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
		export type Parameter = QueryParameter | HeaderParameter | PathParameter | CookieParameter
		export interface Schema {
			$defs?: { [key: string]: Schema }
			additionalProperties?: Schema
			allOf?: Schema[]
			anyOf?: Schema[]
			contains?: Schema
			dependentSchemas?: { [key: string]: Schema }
			// discriminator?: Discriminator
			else?: Schema
			// externalDocs?: ExternalDocumentation
			if?: Schema
			items?: Schema
			not?: Schema
			oneOf?: Schema[]
			patternProperties?: { [propertyNameRegex: string]: Schema }
			prefixItems?: Schema[]
			properties?: { [propertyName: string]: Schema }
			propertyNames?: Schema
			then?: Schema
			unevaluatedItems?: Schema
			unevaluatedProperties?: Schema
			// xml?: undefined | XML
		}
		export interface MediaType {
			encoding?: { [propertyName: string]: Encoding }
			example?: any
			examples?: { [key: string]: Example }
			schema?: Schema
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
		export interface Responses {
			[httpStatusCode: string]: Response
		}
		export interface RequestBody {
			content: { [mediaType: string]: MediaType }
			description?: string
			required?: boolean
		}
		export interface Response {
			content?: { [mediaType: string]: MediaType }
			description: string
			headers?: { [headerName: string]: Header }
			// links?: undefined | { [linkName: string]: Link }
		}
	}
}
