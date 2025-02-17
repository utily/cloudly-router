import { gracely } from "gracely"
import { http } from "cloudly-http"
import { Router } from "../Router"
import { Definition as _Definition } from "./Definition"
import { Endpoint as _Endpoint } from "./Endpoint"
import { Request } from "./Endpoint/Request"

export class Api<C extends object = object> {
	private readonly endpoints: Api.Endpoint<C>[]
	get definition(): Api.Definition {
		return { ...this.details, endpoints: this.endpoints.map(Api.Endpoint.Definition.from) }
	}
	private constructor(readonly router: Router<C>, private readonly details: Omit<Api.Definition, "endpoints">) {}
	add<
		S extends Record<string, any>,
		P extends Record<string, any>,
		H extends Record<keyof http.Request.Header, any>,
		B
	>(endpoint: Api.Endpoint<C, S, P, H, B>): void {
		this.endpoints.push(endpoint as Api.Endpoint<C>)
		this.router.add(endpoint.method, endpoint.path, async (request: http.Request, context: C): Promise<any> => {
			const verified = Request.verify(endpoint.request, request)
			return gracely.Error.is(verified) ? verified : endpoint.execute(verified, context)
		})
	}
	toJSON() {
		return this.definition
	}
	static create<C extends object = object>(
		router: Router<C> | Partial<Router.Options>,
		details: Omit<Api.Definition, "endpoints"> = { name: "unnamed", description: "" }
	): Api<C> {
		return new Api(router instanceof Router ? router : new Router<C>(router), details)
	}
}
export namespace Api {
	export import Definition = _Definition
	export import Endpoint = _Endpoint
}
