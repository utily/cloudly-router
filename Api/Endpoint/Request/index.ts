import { gracely } from "gracely"
import { http } from "cloudly-http"
import { isly } from "isly"
import { Configuration as _Configuration } from "./Configuration"
import { Definition as _Definition } from "./Definition"

export interface Request<
	S extends Record<string, any> = Record<string, any>,
	P extends Record<string, any> = Record<string, any>,
	H extends Record<keyof http.Request.Header, any> = Record<keyof http.Request.Header, any>,
	B = any
> {
	search: S
	parameters: P
	headers: H
	body: B
}
export namespace Request {
	export import Configuration = _Configuration
	export import Definition = _Definition
	export function verify<
		C extends Configuration<S, P, H, B>, // Endpoint configuration
		S extends Record<string, any> = Record<string, never>, // Search Parameter names & types
		P extends Record<string, any> = Record<string, never>, // Path parameter names & types
		H extends Record<keyof http.Request.Header, any> = Record<keyof http.Request.Header, never>, // Header types
		B = never // Body type
	>(configuration: C, request: http.Request): gracely.Error | Request<S, P, H, B> {
		// TODO:
		// * support parsing of arguments
		// * return multiple gracely.Errors
		// * return flaws for all errors
		// * support authentication
		const result: gracely.Error[] = []
		result.push(
			...Object.entries(configuration.parameters ?? {})
				.map(([name, type]) => [name, type.flawed(request.search[name])] as const)
				.map(
					([name, flaw]): false | gracely.Error =>
						flaw && gracely.client.invalidQueryArgument(name, flaw.name, flaw.description ?? "", JSON.stringify(flaw))
				)
				.filter((error: false | gracely.Error): error is gracely.Error => !!error)
		)
		result.push(
			...Object.entries(configuration.search ?? {})
				.map(([name, type]) => [name, type.flawed(request.search[name])] as const)
				.map(
					([name, flaw]): false | gracely.Error =>
						flaw && gracely.client.invalidQueryArgument(name, flaw.name, flaw.description ?? "", JSON.stringify(flaw))
				)
				.filter((error: false | gracely.Error): error is gracely.Error => !!error)
		)
		const flaw = (configuration.body ?? isly.undefined()).flawed(request.body)
		if (flaw)
			result.push(gracely.client.flawedContent(flaw as unknown as gracely.Flaw))
		return result.length > 0
			? result[1]
			: Configuration.toType<C, S, P, H, B>(configuration).prune(request) ?? gracely.client.forbidden("invalid request")
	}
}
