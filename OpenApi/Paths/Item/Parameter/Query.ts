import { isly } from "isly"
import { Schema } from "../../../Schema"
import { Common } from "./Common"

export interface Query extends Common {
	allowEmptyValue?: undefined | boolean
	allowReserved?: undefined | boolean
	in: "query"
}
export namespace Query {
	export function from(search: Record<string, isly.Definition>): Query[] {
		return Object.entries(search).map(([key, value]) => ({
			in: "query",
			description: value.description,
			name: key,
			schema: Schema.from(value),
			required: true,
		}))
	}
}
