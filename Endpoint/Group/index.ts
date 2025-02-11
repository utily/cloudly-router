import { gracely } from "gracely"
import { http } from "cloudly-http"
import { Router } from "../../Router"
import type { Endpoint } from ".."
import { Definition as EndpointDefinition } from "../Definition"
import { Request } from "../Request"
import { Definition as _Definition } from "./Definition"

export class Group<C extends object = object> {
	private readonly endpoints: Endpoint<C>[]
	get definition(): Group.Definition {
		return { ...this.details, endpoints: this.endpoints.map(EndpointDefinition.from) }
	}
	constructor(private readonly details: Omit<Group.Definition, "endpoints">) {}
	add<
		S extends Record<string, any> = Record<string, never>,
		P extends Record<string, any> = Record<string, never>,
		H extends Record<keyof http.Request.Header, any> = Record<keyof http.Request.Header, never>,
		B = never
	>(endpoint: Endpoint<C, S, P, H, B>): void {
		this.endpoints.push(endpoint as Endpoint<C>)
	}
	register(router: Router<C>): void {
		for (const endpoint of this.endpoints) {
			router.add(endpoint.method, endpoint.path, async (request: http.Request, context: C): Promise<any> => {
				const verified = Request.verify(endpoint.request, request)
				return gracely.Error.is(verified) ? verified : endpoint.execute(verified, context)
			})
		}
	}
	toJSON() {
		return this.definition
	}
}
export namespace Group {
	export import Definition = _Definition
}
