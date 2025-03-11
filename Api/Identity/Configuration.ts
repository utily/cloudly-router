import { http } from "cloudly-http"
import { isly } from "isly"
import type { Identity } from "."

export interface Configuration<I extends Identity | undefined, Token = string> {
	name: string
	description: string
	header: { name: keyof http.Request.Header; type: isly.Type<Token> }
	type: isly.Type<I>
	authenticate: (token: Token) => Promise<I | undefined>
}
export namespace Configuration {}
