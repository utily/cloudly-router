import { Api } from "../Api"

export interface Tag {
	description?: string
	externalDocs?: Tag.ExternalDocumentation
	name: string
}
export namespace Tag {
	export interface ExternalDocumentation {
		description?: string
		url: string
	}
	export function from(collections: Api.Definition.Collection[] | undefined): Tag[] | undefined {
		return collections?.map(collection => ({
			description: collection.description,
			name: collection.name,
		}))
	}
}
