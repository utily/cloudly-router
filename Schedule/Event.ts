export interface Event {
	readonly date: Date
	readonly cron: string
}
export namespace Event {
	export function from(scheduled: Scheduled): Event {
		return { cron: scheduled.cron, date: new Date(scheduled.scheduledTime) }
	}
	export interface Scheduled {
		readonly scheduledTime: number
		readonly cron: string
	}
}
