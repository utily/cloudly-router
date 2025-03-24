import "./item"
import { Context } from "./Context"

export const environment = {
	items: "aaaa, bbbb, cccc, dddd, eeee, ffff, gggg, hhhh, iiii, jjjj",
}
export const context = Context.create(environment)
