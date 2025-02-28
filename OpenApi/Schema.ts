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
	patternProperties?: { [propertyNameRegex: string]: Schema }
	prefixItems?: Schema[]
	properties?: { [propertyName: string]: Schema }
	propertyNames?: Schema
	then?: Schema
	unevaluatedItems?: Schema
	unevaluatedProperties?: Schema
}
export namespace Schema {
	const transformer = isly.Definition.Transformer.create<Record<string, Schema | undefined>>({
		boolean: (type: isly.Boolean.Definition): Schema => ({
			type: type.class,
			description: type.description,
		}),
		number: (type: isly.Number.Definition): Schema => ({
			type: type.class,
			description: type.description,
		}),
		string: (type: isly.String.Definition): Schema => ({
			type: type.class,
			description: type.description,
		}),
		object: (type: isly.Object.Definition, transformer): Schema => ({
			type: type.class,
			description: type.description,
			properties: Object.entries(type.properties).reduce(
				(r, [key, value]) => ({ ...r, [key]: transformer.transform(value) }),
				{}
			),
		}),
		array: (type: isly.Array.Definition, transformer): Schema => ({
			type: type.class,
			description: type.description,
			items: transformer.transform(type.base),
		}),
		union: (type: isly.Union.Definition, transformer): Schema | undefined => ({
			oneOf: type.base.flatMap(t => transformer.transform(t) ?? []),
		}),
		optional: (type: isly.Optional.Definition, transformer): Schema | undefined => transformer.transform(type.base),
		readonly: (type: isly.Readonly.Definition, transformer): Schema | undefined => transformer.transform(type.base),
	})
	export function from(definition: isly.Definition | undefined): Schema | undefined {
		return definition && transformer.transform(definition)
	}
}
