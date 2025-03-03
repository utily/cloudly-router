import { Api } from "../../../../Api"
import { Common } from "./Common"
import { Header as _Header } from "./Header"
import { Path as _Path } from "./Path"
import { Query as _Query } from "./Query"

export type Parameter = Parameter.Query | Parameter.Header | Parameter.Path
export namespace Parameter {
	export function from(request: Api.Endpoint.Request.Definition): Parameter[] {
		return [...Path.from(request.parameter), ...Header.from(request.header), ...Query.from(request.search)]
	}
	export import Header = _Header
	export import Path = _Path
	export import Query = _Query
	export type Example = Common.Example
}
