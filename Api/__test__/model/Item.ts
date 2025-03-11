import { isly } from "isly"
import { Identifier } from "./Identifier"

export interface Item extends Item.Creatable {
	id: Identifier
}
export namespace Item {
	export interface Creatable {
		number: number
	}
	export namespace Creatable {
		export const { type, is, flawed } = isly
			.object<Creatable>({
				number: isly.number(),
			})
			.bind()
	}
	export const { type, is, flawed } = Creatable.type
		.extend<Item>({
			id: Identifier.type,
		})
		.bind()
}
