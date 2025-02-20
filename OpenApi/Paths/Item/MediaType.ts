import { isly } from "isly"
import { Reference } from "../../Reference"
import { Schema } from "../../Schema"
import { Parameter } from "./Parameter"

export interface MediaType {
	encoding?: { [propertyName: string]: Parameter.Encoding }
	example?: any
	examples?: { [key: string]: Parameter.Example }
	schema?: Schema | Reference
}
export namespace MediaType {
	export function from(response: isly.Definition): MediaType {
		return {
			schema: Reference.from(response),
		}
	}
}
