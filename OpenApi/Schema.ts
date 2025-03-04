import { isly } from "isly"

export interface Schema {
	type?: string
	description?: string
	$defs?: { [key: string]: Schema }
	additionalProperties?: Schema
	allOf?: Schema[]
	anyOf?: Schema[]
	contains?: Schema
	dependentSchemas?: { [key: string]: Schema }
	else?: Schema
	if?: Schema
	items?: Schema
	not?: Schema
	oneOf?: Schema[]
	enum?: any[]
	minItems?: number
	maxItems?: number
	additionalItems?: boolean
	patternProperties?: { [propertyNameRegex: string]: Schema }
	prefixItems?: Schema[]
	properties?: { [propertyName: string]: Schema }
	propertyNames?: Schema
	then?: Schema
	unevaluatedItems?: Schema
	unevaluatedProperties?: Schema
	required?: string[]
}
export namespace Schema {
	const transformer = isly.Definition.Transformer.create<Record<string, Schema | undefined>>({
		boolean: (type: isly.Boolean.Definition): Schema => ({
			type: type.class,
			description: type.description,
			enum: type.condition?.flatMap(condition => convertCondition(condition)),
		}),
		number: (type: isly.Number.Definition): Schema => ({
			type: type.class,
			description: type.description,
			enum: type.condition?.flatMap(condition => convertCondition(condition)),
		}),
		string: (type: isly.String.Definition): Schema => ({
			type: type.class,
			description: type.description,
			enum: type.condition?.flatMap(condition => convertCondition(condition)),
		}),
		object: (type: isly.Object.Definition, transformer): Schema => ({
			type: type.class,
			description: type.description,
			properties: Object.entries(type.properties).reduce(
				(r, [key, value]) => ({ ...r, [key]: transformer.transform(value) }),
				{}
			),
			required: Object.entries(type.properties).flatMap(([key, value]) => (value.class === "optional" ? [] : key)),
		}),
		array: (type: isly.Array.Definition, transformer): Schema => ({
			type: type.class,
			description: type.description,
			items: transformer.transform(type.base),
		}),
		tuple: (type: isly.Tuple.Definition, transformer): Schema | undefined => ({
			type: "array",
			description: type.description,
			oneOf: type.base.flatMap(t => transformer.transform(t) ?? []),
			minItems: type.base.length,
			maxItems: type.base.length,
		}),
		union: (type: isly.Union.Definition, transformer): Schema | undefined => ({
			oneOf: type.base.flatMap(t => transformer.transform(t) ?? []),
		}),
		optional: (type: isly.Optional.Definition, transformer): Schema | undefined =>
			transformer.transform({
				...type.base,
				description: type.description ?? type.base.description,
				name: type.name ?? type.base.name,
			}),
		readonly: (type: isly.Readonly.Definition, transformer): Schema | undefined =>
			transformer.transform({
				...type.base,
				description: type.description ?? type.base.description,
				name: type.name ?? type.base.name,
			}),
	})
	export function from(definition: isly.Definition | undefined): Schema | undefined {
		return definition && transformer.transform(definition)
	}
	export function convertCondition(condition: string): any {
		return condition.startsWith("value: ") ? JSON.parse(condition.substring(7).replaceAll("'", '"')) : undefined
	}
}
