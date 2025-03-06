import { isly } from "isly"

export interface Reference {
	$ref: string
	description?: undefined | string
	summary?: undefined | string
}
export namespace Reference {
	export function from(value: isly.Definition): Reference {
		return {
			$ref: `#/components/schemas/${value.name}`,
		}
	}
}
