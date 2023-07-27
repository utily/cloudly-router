import { Router } from "../index"

const cron = "5 * * * *"

const scheduledTimeFirst = new Date().setHours(14)
const scheduledTimeSecond = new Date().setHours(3)
const scheduledTimeBoth = new Date().setHours(5)

const events = [
	{ name: "first", scheduledTime: scheduledTimeFirst, cron, expect: { firstCalls: 1, secondCalls: 0 } },
	{ name: "second", scheduledTime: scheduledTimeSecond, cron, expect: { firstCalls: 0, secondCalls: 1 } },
	{ name: "third", scheduledTime: scheduledTimeBoth, cron, expect: { firstCalls: 1, secondCalls: 1 } },
	{ name: "fourth", scheduledTime: scheduledTimeBoth, cron, expect: { firstCalls: 1, secondCalls: 0 }, response: true },
	{ name: "fifth", scheduledTime: new Date().setHours(2), cron, expect: { firstCalls: 0, secondCalls: 0 } },
	{ name: "sixth", scheduledTime: scheduledTimeFirst, cron: "* * * * *" },
]

describe.each(events)("scheduled", (event: typeof events[number]) => {
	const router = new Router()
	const firstHandler = jest.fn(async () => event.response ?? false)
	const secondHandler = jest.fn(async () => event.response ?? false)
	router.schedule.add([cron], { hours: [14, [4, 6]] }, firstHandler)
	router.schedule.add([cron], { hours: [3, 5] }, secondHandler)
	router.schedule.add([cron], { hours: [3, 5] }, async (event: Router.Schedule.Event) => true)
	router.schedule.handle(event, {})
	it(`${event.name} event`, () => {
		expect(firstHandler).toBeCalledTimes(event.expect?.firstCalls ?? 0)
		expect(secondHandler).toBeCalledTimes(event.expect?.secondCalls ?? 0)
	})
})
