// based on https://github.com/fosfad/openapi-typescript-definitions

export namespace schema {
	export interface Callback {
		[expression: string]: PathItem | Reference
	}
	export interface Components {
		callbacks?: undefined | { [key: string]: Callback | Reference }
		examples?: undefined | { [key: string]: Example | Reference }
		headers?: undefined | { [key: string]: Header | Reference }
		links?: undefined | { [key: string]: Link | Reference }
		parameters?: undefined | { [key: string]: Parameter | Reference }
		pathItems?: undefined | { [key: string]: PathItem | Reference }
		requestBodies?: undefined | { [key: string]: RequestBody | Reference }
		responses?: undefined | { [key: string]: Response | Reference }
		schemas?: undefined | { [key: string]: Schema }
		securitySchemes?: undefined | { [key: string]: SecurityScheme | Reference }
	}
	export interface Contact {
		email?: undefined | string
		name?: undefined | string
		url?: undefined | string
	}
	export interface Discriminator {
		mapping?: undefined | { [discriminatorValue: string]: string }
		propertyName: string
	}
	export interface Encoding {
		allowReserved?: undefined | boolean
		contentType?: undefined | string
		explode?: undefined | boolean
		headers?: undefined | { [headerName: string]: Header | Reference }
		style?: undefined | string
	}
	export interface Example {
		description?: undefined | string
		externalValue?: undefined | string
		summary?: undefined | string
		value?: undefined | any
	}
	export interface ExternalDocumentation {
		description?: undefined | string
		url: string
	}
	export type Header = Omit<HeaderParameter, "in" | "name">

	export interface Info {
		contact?: undefined | Contact
		description?: undefined | string
		license?: undefined | License
		summary?: undefined | string
		termsOfService?: undefined | string
		title: string
		version: string
	}
	export interface License {
		identifier?: undefined | string
		name: string
		url?: undefined | string
	}
	export interface Link {
		description?: undefined | string
		operationId?: undefined | string
		operationRef?: undefined | string
		parameters?: undefined | { [name: string]: string | any }
		requestBody?: undefined | string | any
		server?: undefined | Server
	}
	export interface MediaType {
		encoding?: undefined | { [propertyName: string]: Encoding }
		example?: undefined | any
		examples?: undefined | { [key: string]: Example | Reference }
		schema?: undefined | Schema
	}
	interface CommonOAuthFlow {
		refreshUrl?: undefined | string
		scopes: { [scopeName: string]: string }
	}
	export interface AuthorizationCodeOAuthFlow extends CommonOAuthFlow {
		authorizationUrl: string
		tokenUrl: string
	}
	export interface ClientCredentialsOAuthFlow extends CommonOAuthFlow {
		tokenUrl: string
	}
	export interface ImplicitOAuthFlow extends CommonOAuthFlow {
		authorizationUrl: string
	}
	export interface ResourceOwnerPasswordOAuthFlow extends CommonOAuthFlow {
		tokenUrl: string
	}
	export interface OAuthFlows {
		authorizationCode?: undefined | AuthorizationCodeOAuthFlow
		clientCredentials?: undefined | ClientCredentialsOAuthFlow
		implicit?: undefined | ImplicitOAuthFlow
		password?: undefined | ResourceOwnerPasswordOAuthFlow
	}
	export const openapiVersion = "3.1.0"

	export interface OpenAPI {
		components?: undefined | Components
		externalDocs?: undefined | ExternalDocumentation
		info: Info
		jsonSchemaDialect?: undefined | string
		openapi: typeof openapiVersion
		paths: Paths
		security?: undefined | SecurityRequirement[]
		servers?: undefined | Server[]
		tags?: undefined | Tag[]
		webhooks?: undefined | { [webhookName: string]: PathItem | Reference }
	}
	export interface Operation {
		callbacks?: undefined | { [callbackIdentifier: string]: Callback | Reference }
		deprecated?: undefined | boolean
		description?: undefined | string
		externalDocs?: undefined | ExternalDocumentation
		operationId?: undefined | string
		parameters?: undefined | Array<Parameter | Reference>
		requestBody?: undefined | RequestBody | Reference
		responses?: undefined | Responses
		security?: undefined | Array<SecurityRequirement>
		servers?: undefined | Array<Server>
		summary?: undefined | string
		tags?: undefined | Array<string>
	}
	interface CommonParameter {
		content?: undefined | { [mediaType: string]: MediaType }
		deprecated?: undefined | boolean
		description?: undefined | string
		example?: undefined | any
		examples?: undefined | { [key: string]: Example | Reference }
		explode?: undefined | boolean
		name: string
		required?: undefined | boolean
		schema?: undefined | Schema
		style?: undefined | string
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

	export interface PathItem {
		$ref?: undefined | string
		delete?: undefined | Operation
		description?: undefined | string
		get?: undefined | Operation
		head?: undefined | Operation
		options?: undefined | Operation
		parameters?: undefined | Array<Parameter | Reference>
		patch?: undefined | Operation
		post?: undefined | Operation
		put?: undefined | Operation
		servers?: undefined | Server[]
		summary?: undefined | string
		trace?: undefined | Operation
	}
	export interface Paths {
		[path: string]: PathItem
	}
	export interface Reference {
		$ref: string
		description?: undefined | string
		summary?: undefined | string
	}
	export interface RequestBody {
		content: { [mediaType: string]: MediaType }
		description?: undefined | string
		required?: undefined | boolean
	}
	export interface Response {
		content?: undefined | { [mediaType: string]: MediaType }
		description: string
		headers?:
			| undefined
			| {
					[headerName: string]: Header | Reference
			  }
		links?: undefined | { [linkName: string]: Link | Reference }
	}
	export interface Responses {
		[httpStatusCode: string]: Response | Reference
	}
	export interface SchemaObject {
		$defs?: undefined | { [key: string]: Schema }
		additionalProperties?: undefined | Schema
		allOf?: undefined | Array<Schema>
		anyOf?: undefined | Array<Schema>
		contains?: undefined | Schema
		dependentSchemas?: undefined | { [key: string]: Schema }
		discriminator?: undefined | Discriminator
		else?: undefined | Schema
		externalDocs?: undefined | ExternalDocumentation
		if?: undefined | Schema
		items?: undefined | Schema
		not?: undefined | Schema
		oneOf?: undefined | Array<Schema>
		patternProperties?: undefined | { [propertyNameRegex: string]: Schema }
		prefixItems?: undefined | Array<Schema>
		properties?: undefined | { [propertyName: string]: Schema }
		propertyNames?: undefined | Schema
		then?: undefined | Schema
		unevaluatedItems?: undefined | Schema
		unevaluatedProperties?: undefined | Schema
		xml?: undefined | XML
	}
	export type Schema = SchemaObject

	export interface SecurityRequirement {
		[name: string]: string[]
	}
	interface CommonSecurityScheme {
		description?: undefined | string
	}
	export interface ApiKeySecurityScheme extends CommonSecurityScheme {
		in: "query" | "header" | "cookie"
		name: string
		type: "apiKey"
	}
	export interface HttpSecurityScheme extends CommonSecurityScheme {
		bearerFormat?: undefined | string
		scheme: string
		type: "http"
	}
	export interface OAuth2SecurityScheme extends CommonSecurityScheme {
		flows: OAuthFlows
		type: "oauth2"
	}
	export interface OpenIdConnectSecurityScheme extends CommonSecurityScheme {
		openIdConnectUrl: string
		type: "openIdConnect"
	}
	export type SecurityScheme =
		| ApiKeySecurityScheme
		| HttpSecurityScheme
		| OAuth2SecurityScheme
		| OpenIdConnectSecurityScheme

	export interface Server {
		description?: undefined | string
		url: string
		variables?: undefined | { [variableName: string]: ServerVariable }
	}
	export interface ServerVariable {
		default: string
		description?: undefined | string
		enum?: undefined | string[]
	}
	export interface Tag {
		description?: undefined | string
		externalDocs?: undefined | ExternalDocumentation
		name: string
	}
	export interface XML {
		attribute?: undefined | boolean
		name?: undefined | string
		namespace?: undefined | string
		prefix?: undefined | string
		wrapped?: undefined | boolean
	}
}
