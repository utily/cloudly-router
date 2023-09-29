import { Event as ScheduleEvent } from "./Event"
import { Handler as ScheduleExecutor } from "./Handler"
import { TimeSlot as ScheduleTimeSlot } from "./TimeSlot"

type Action<T> = {
	cron: string[]
	timetable: Schedule.Timetable
	handle: ScheduleExecutor<T>
}

export class Schedule<T> {
	private readonly actions: Action<T>[] = []
	async handle(scheduled: Schedule.Event.Scheduled, context: T): Promise<void> {
		const event = Schedule.Event.from(scheduled)
		for (const action of this.actions) {
			action.cron.some(c => c == event.cron) &&
				Schedule.Timetable.check(action.timetable, event.date) &&
				(await action.handle(event, context))
		}
	}
	add(cron: string[], timetable: Schedule.Timetable, handle: ScheduleExecutor<T>): void {
		this.actions.push({ cron, timetable, handle })
	}
}

export namespace Schedule {
	export type Event = ScheduleEvent
	export namespace Event {
		export type Scheduled = ScheduleEvent.Scheduled
		export const from = ScheduleEvent.from
	}
	export type Executor<T> = ScheduleExecutor<T>
	export type Timetable = ScheduleTimeSlot
	export const Timetable = ScheduleTimeSlot
}
