import { gracely } from "gracely"
import { http } from "cloudly-http"
import { isly } from "isly"
import { Configuration as _Configuration } from "./Configuration"
import { Definition as _Definition } from "./Definition"

export interface Request<
	S extends Record<string, any>, //Search parameters
	P extends Record<string, any>, //Path arguments
	H extends Record<keyof http.Request.Header, any>, //Headers
	B //Body
> {
	search: S
	parameter: P
	header: H
	body: B
}
export namespace Request {
	export import Configuration = _Configuration
	export import Definition = _Definition
	export async function verify<
		S extends Record<string, any>, // Search Parameter names & types
		P extends Record<string, any>, // Path parameter names & types
		H extends Record<keyof http.Request.Header, any>, // Header types
		B // Body type
	>(configuration: Configuration<S, P, H, B>, request: http.Request): Promise<gracely.Error | Request<S, P, H, B>> {
		// TODO:
		// * support parsing of arguments
		// * return multiple gracely.Errors
		// * return flaws for all errors
		// * support authentication
		const result: gracely.Error[] = []
		result.push(
			...Object.entries(configuration.parameter ?? {})
				.map(([name, type]) => [name, type.flawed(request.parameter[name])] as const)
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
		return result[0]
			? result[0]
			: Configuration.toType<S, P, H, B>(configuration).prune(request) ?? gracely.client.forbidden("invalid request")
	}
}
