import { isly } from "isly"

export interface Permissions {
	item?:
		| {
				read?: boolean
				write?: boolean
		  }
		| true
	version?: { admin?: boolean } | true
}
export namespace Permissions {
	export const { type, is, flawed } = isly
		.object<Permissions>({
			item: isly
				.object({
					read: isly.boolean().optional(),
					write: isly.boolean().optional(),
				})
				.optional(),
			version: isly
				.object({
					admin: isly.boolean().optional(),
				})
				.optional(),
		})
		.bind()
}
