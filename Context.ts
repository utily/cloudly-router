import { Callback } from "./Callback"
export class Context {
	private callbacks: Callback[]
	constructor() {
		this.callbacks = []
	}
	register(callback: Callback): void {
		this.callbacks.push(callback)
	}
	error(error: Error) {
		for (const callback of this.callbacks) {
			callback.error(error)
		}
	}
	async finish() {
		console.log("Executing, ", this.callbacks.length, " Callbacks.")
		for (const callback of this.callbacks) {
			await callback.execute()
		}
	}
}
