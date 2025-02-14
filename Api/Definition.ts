import { Definition as EndpointDefinition } from "./Endpoint/Definition"

export interface Definition {
	name: string
	description: string
	endpoints: EndpointDefinition[]
}
export namespace Definition {}
