import { http } from "cloudly-http"
import { isly } from "isly"
import type { Request } from "."

export interface Configuration<
	S extends Record<string, any> = Record<string, never>,
	P extends Record<string, any> = Record<string, never>,
	H extends Record<keyof http.Request.Header, any> = Record<keyof http.Request.Header, never>,
	B = never
> {
	search?: {
		[N in keyof S]: isly.Type<S[N]>
	}
	parameters?: {
		[N in keyof P]: isly.Type<P[N]>
	}
	headers?: {
		[N in keyof H]: isly.Type<H[N]>
	}
	body?: isly.Type<B>
}
export namespace Configuration {
	export function toType<
		C extends Configuration<S, P, H, B>,
		S extends Record<string, any> = Record<string, never>,
		P extends Record<string, any> = Record<string, never>,
		H extends Record<keyof http.Request.Header, any> = Record<keyof http.Request.Header, never>,
		B = never
	>(configuration: C): isly.Object<Request<S, P, H, B>> {
		return isly.object<Request<S, P, H, B>>({
			search: isly.object(configuration.search ?? ({} as S)),
			parameters: isly.object(configuration.parameters ?? ({} as P)),
			headers: isly.object(configuration.headers ?? ({} as H)),
			body: configuration.body ?? (isly.undefined() as isly.Type<B>),
		})
	}
}
