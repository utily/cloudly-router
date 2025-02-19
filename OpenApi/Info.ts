import { Api } from "../Api"

export interface Info {
	// contact?: undefined | Contact
	description?: string
	// license?: License
	summary?: string
	termsOfService?: string
	title: string
	version: string
}
export namespace Info {
	export function from(api: Api.Definition): Info {
		return {
			description: api.description,
			title: api.name,
			version: api.version,
		}
	}
}
