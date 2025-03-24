import { isly } from "isly"

export interface Environment {
	items: string
}
export namespace Environment {
	export const { type, is, flawed } = isly
		.object<Environment>({
			items: isly.string(),
		})
		.bind()
}
