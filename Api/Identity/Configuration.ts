import { gracely } from "gracely"
import { http } from "cloudly-http"
import { isly } from "isly"
import type { Identity } from "."

export interface Configuration<I extends Identity | undefined, Context = unknown, Token = string> {
	name: string
	description: string
	header: { name: keyof http.Request.Header; type: isly.Type<Token> }
	type: isly.Type<I>
	authenticate: (token: Token, context: Context) => Promise<I | gracely.Error | undefined>
}
export namespace Configuration {}
