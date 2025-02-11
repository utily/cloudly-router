import { Definition as EndpointDefinition } from "../Definition"

export interface Definition {
	name: string
	description: string
	endpoints: EndpointDefinition[]
}
export namespace Definition {}
