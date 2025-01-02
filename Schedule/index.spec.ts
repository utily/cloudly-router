import { Router } from "../index"

const cron = "5 * * * *"

const scheduledTimeFirst = new Date().setUTCHours(14)
const scheduledTimeSecond = new Date().setUTCHours(3)
const scheduledTimeBoth = new Date().setUTCHours(5)

const events = [
	{ name: "first", scheduledTime: scheduledTimeFirst, cron, expect: { firstCalls: 1, secondCalls: 0 } },
	{ name: "second", scheduledTime: scheduledTimeSecond, cron, expect: { firstCalls: 0, secondCalls: 1 } },
	{ name: "third", scheduledTime: scheduledTimeBoth, cron, expect: { firstCalls: 1, secondCalls: 1 } },
	{ name: "fourth", scheduledTime: new Date().setUTCHours(2), cron, expect: { firstCalls: 0, secondCalls: 0 } },
	{ name: "fifth", scheduledTime: scheduledTimeFirst, cron: "* * * * *" },
]

describe.each(events)("scheduled", (event: typeof events[number]) => {
	const router = new Router()
	const firstHandler = vitest.fn(async () => undefined)
	const secondHandler = vitest.fn(async () => undefined)
	router.schedule.add([cron], { hours: [14, [4, 6]] }, firstHandler)
	router.schedule.add([cron], { hours: [3, 5] }, secondHandler)
	router.schedule.handle(event, {})
	it(`${event.name} event`, () => {
		expect(firstHandler).toBeCalledTimes(event.expect?.firstCalls ?? 0)
		expect(secondHandler).toBeCalledTimes(event.expect?.secondCalls ?? 0)
	})
})
