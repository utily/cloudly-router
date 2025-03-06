import { isly } from "isly"
import { Schema } from "../../../Schema"
import { Common } from "./Common"

export interface Path extends Common {
	in: "path"
	required: true
}
export namespace Path {
	export function from(parameter: Record<string, isly.Definition>): Path[] {
		return Object.entries(parameter).map(([key, value]) => ({
			in: "path",
			description: value.description,
			name: key,
			schema: Schema.from(value),
			required: true,
		}))
	}
}
