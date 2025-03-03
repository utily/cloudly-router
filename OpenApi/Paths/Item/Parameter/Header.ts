import { isly } from "isly"
import { Schema } from "../../../Schema"
import { Common } from "./Common"

export interface Header extends Common {
	in: "header"
}
export namespace Header {
	export function from(header: Record<string, isly.Definition>): Header[] {
		return Object.entries(header).map(([key, value]) => ({
			in: "header",
			description: value.description,
			name: key,
			schema: Schema.from(value),
			required: true,
		}))
	}
}
