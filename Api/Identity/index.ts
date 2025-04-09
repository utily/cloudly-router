import { gracely } from "gracely"
import { http } from "cloudly-http"
import { isly } from "isly"
import { Configuration as _Configuration } from "./Configuration"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Identity {}

export namespace Identity {
	export import Configuration = _Configuration
	export async function verify<I extends Identity | undefined, Context = unknown>(
		configurations: Configuration<I>[],
		header: http.Request.Header,
		context: Context
	): Promise<I | gracely.Error | isly.Flaw[]> {
		const configuration = configurations.find(configuration =>
			configuration.header.type.is(header[configuration.header.name])
		)
		const token = configuration?.header.type.get(header[configuration.header.name])
		const result: I | gracely.Error | undefined =
			token != undefined ? await configuration?.authenticate(token, context) : undefined
		return result != undefined
			? result
			: (configuration
					? [configuration.header.type.flawed(header[configuration.header.name])]
					: configurations.map(configuration => configuration.header.type.flawed(header[configuration.header.name]))
			  ).filter(isly.boolean(false).inverse().bind().is)
	}
}
