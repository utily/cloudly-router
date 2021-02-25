export interface Callback {
	execute: () => Promise<void>
	error: (error: Error) => void
}
