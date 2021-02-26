export interface Callback {
	execute: () => Promise<void>
	error: (error: Error) => void
}
export namespace Callback {
	export function is(value: Callback | any): value is Callback {
		return typeof value == "object" && typeof value.execute == "function" && typeof value.error == "function"
	}
}
