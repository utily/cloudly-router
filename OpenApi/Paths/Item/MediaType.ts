import { isly } from "isly"
import { Reference } from "../../Reference"
import { Schema } from "../../Schema"
import { Encoding, Example } from "./Parameter"

export interface MediaType {
	encoding?: { [propertyName: string]: Encoding }
	example?: any
	examples?: { [key: string]: Example }
	schema?: Schema | Reference
}
export namespace MediaType {
	export function from(response: isly.Definition): MediaType {
		return {
			schema: Reference.from(response),
		}
	}
}
