import { Definition as EndpointDefinition } from "./Endpoint/Definition"

export interface Definition {
	name: string
	description: string
	endpoints: EndpointDefinition[]
	version: `v${number}`
	collections?: Definition.Collection[]
}
export namespace Definition {
	export type Collection = { name: string; description: string }
}
