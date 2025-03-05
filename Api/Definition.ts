import { Definition as EndpointDefinition } from "./Endpoint/Definition"

export interface Definition {
	name: string
	description: string
	endpoints: EndpointDefinition[]
	tags?: Definition.Tag[]
}
export namespace Definition {
	export type Tag = { name: string; description: string }
}
