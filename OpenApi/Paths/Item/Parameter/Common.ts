import { Schema } from "../../../Schema"
import { MediaType } from "../MediaType"

export interface Common {
	content?: { [mediaType: string]: MediaType }
	deprecated?: boolean
	description?: string
	example?: any
	examples?: { [key: string]: Common.Example }
	explode?: boolean
	name: string
	required?: boolean
	schema?: Schema
	style?: string
}
export namespace Common {
	export interface Example {
		description?: string
		externalValue?: string
		summary?: string
		value?: any
	}
}
