import { http } from "cloudly-http"
import { isly } from "isly"
import type { Response } from "."

export interface Configuration<
	H extends Record<keyof http.Response.Header, any> = Record<keyof http.Response.Header, never>,
	B = never
> {
	header?: {
		[N in keyof H]: isly.Type<H[N]>
	}
	body?: isly.Type<B>
	status: isly.Type<number>
}
export namespace Configuration {
	export function toType<
		H extends Record<keyof http.Response.Header, any> = Record<keyof http.Response.Header, never>,
		B = never
	>(configuration: Configuration<H, B>): isly.Object<Response<H, B>> {
		return isly.object<Response<H, B>>({
			header: isly.object(configuration.header ?? ({} as H)),
			body: configuration.body ?? (isly.undefined() as isly.Type<B>),
			status: configuration.status,
		})
	}
}
