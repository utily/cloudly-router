import { http } from "cloudly-http"
import { isly } from "isly"
import { Identity } from "../../Identity"
import type { Request } from "."

export interface Configuration<
	S extends Record<string, any> = Record<string, never>,
	P extends Record<string, any> = Record<string, never>,
	H extends Record<keyof http.Request.Header, any> = Record<keyof http.Request.Header, never>,
	I extends Identity | undefined = Identity,
	B = never
> {
	search?: {
		[N in keyof S]: isly.Type<S[N]>
	}
	parameter?: {
		[N in keyof P]: isly.Type<P[N]>
	}
	header?: {
		[N in keyof H]: isly.Type<H[N]>
	}
	identity?: Identity.Configuration<I>[]
	body?: isly.Type<B>
}
export namespace Configuration {
	export function toType<
		S extends Record<string, any> = Record<string, never>,
		P extends Record<string, any> = Record<string, never>,
		H extends Record<keyof http.Request.Header, any> = Record<keyof http.Request.Header, never>,
		I extends Identity | undefined = Identity,
		B = never
	>(configuration: Configuration<S, P, H, I, B>): isly.Object<Request<S, P, H, I, B>> {
		return isly.object<Request<S, P, H, I, B>>({
			search: isly.object(configuration.search ?? ({} as S)),
			parameter: isly.object(configuration.parameter ?? ({} as P)),
			header: isly.object(configuration.header ?? ({} as H)),
			identity: configuration.identity
				? isly.union(...configuration.identity.map(identity => identity.type))
				: (isly.undefined() as unknown as isly.Type<I>),
			body: configuration.body ?? (isly.undefined() as isly.Type<B>),
		})
	}
}
