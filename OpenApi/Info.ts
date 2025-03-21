import { Api } from "../Api"

export interface Info {
	description?: string
	summary?: string
	termsOfService?: string
	title: string
	version: string
}
export namespace Info {
	export function from(api: Api.Definition, version: string): Info {
		return {
			description: api.description,
			title: api.name,
			version,
		}
	}
}
