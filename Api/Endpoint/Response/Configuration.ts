import { http } from "cloudly-http"
import { isly } from "isly"
import type { Response } from "."

export interface Configuration<H extends Record<keyof http.Request.Header, any>, B> {
	headers?: {
		[N in keyof H]: isly.Type<H[N]>
	}
	body?: isly.Type<B>
}
export namespace Configuration {
	export function toType<
		H extends Record<keyof http.Request.Header, any> = Record<keyof http.Request.Header, never>,
		B = never
	>(configuration: Configuration<H, B>): isly.Object<Response<H, B>> {
		return isly.object<Response<H, B>>({
			headers: isly.object(configuration.headers ?? ({} as H)),
			body: configuration.body ?? (isly.undefined() as isly.Type<B>),
		})
	}
}
