export interface TimeSlot {
	days?: (number | TimeSlot.Interval)[]
	hours?: (number | TimeSlot.Interval)[]
	minutes?: (number | TimeSlot.Interval)[]
}

export namespace TimeSlot {
	const getFunctions = { days: "getDay", hours: "getHours", minutes: "getMinutes" } as const
	export function check(timetable: TimeSlot, date: Date): boolean {
		return Object.entries(timetable).every((e: ["days" | "hours" | "minutes", (number | TimeSlot.Interval)[]]) => {
			const quantity = date[getFunctions[e[0]]]()
			return e[1].some(i => (typeof i == "number" ? i == quantity : i[0] < quantity && quantity < i[1]))
		})
	}
	export type Interval = [number, number]
}
