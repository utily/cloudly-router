import { isly } from "isly"
import { Environment as _Environment } from "./Environment"
import { Identity as _Identity } from "./Identity"
import { Items } from "./Items"

export class Context {
	#items: Items | undefined
	get items(): Items {
		return (this.#items ??= Items.create(
			this.environment.items
				.split(",")
				.map(id => id.trim())
				.map((id, number) => ({
					id,
					number,
				}))
		))
	}
	private constructor(private readonly environment: Context.Environment | any) {}
	static create(environment: Context.Environment): Context | isly.Flaw {
		return Context.Environment.flawed(environment) || new Context(environment)
	}
}
export namespace Context {
	export import Environment = _Environment
	export import Identity = _Identity
}
