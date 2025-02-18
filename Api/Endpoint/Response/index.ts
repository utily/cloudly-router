import { gracely } from "gracely"
import { http } from "cloudly-http"
import { Configuration as _Configuration } from "./Configuration"
import { Definition as _Definition } from "./Definition"

export interface Response<
	H extends Record<keyof http.Response.Header, any> | undefined, //Headers
	B //Body
> {
	headers: H
	body: B | gracely.Error
}
export namespace Response {
	export import Configuration = _Configuration
	export import Definition = _Definition
}
