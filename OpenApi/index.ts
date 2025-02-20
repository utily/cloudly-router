import { Api } from "../Api"
import { Components } from "./Components"
import { Info } from "./Info"
import { Paths } from "./Paths"
import { Tag } from "./Tag"

export interface OpenApi {
	components?: Components
	// externalDocs?: undefined | ExternalDocumentation
	info: Info
	jsonSchemaDialect?: string
	openapi: "3.0.2"
	paths: Paths
	// security?: undefined | SecurityRequirement[]
	servers?: { description?: string; url: string }
	tags?: Tag[]
	// webhooks?: undefined | { [webhookName: string]: PathItem | Reference }
}
export namespace OpenApi {
	export function from(api: Api<any>): OpenApi {
		const definition = api.definition
		return {
			info: Info.from(definition),
			// jsonSchemaDialect: "https://json-schema.org/draft/2020-12/schema",
			openapi: "3.0.2",
			paths: Paths.from(definition.endpoints),
			components: Components.from(definition.endpoints),
			tags: Tag.from(definition.collections),
		}
	}
}
