import { isly } from "isly"
import { Api } from "../../../index"
import { Permissions } from "./Permissions"

export class Identity implements Api.Identity {
	constructor(readonly id: string, readonly permissions: Permissions) {}
	permitted(permissions: Permissions): boolean {
		// TODO: do something more meaningful here
		return !!(
			(permissions.item == true ||
				(permissions.item &&
					permissions.item.read == true &&
					(this.permissions.item == true || this.permissions.item?.read))) &&
			(permissions.version == true ||
				(permissions.version &&
					permissions.version.admin == true &&
					(this.permissions.version == true || this.permissions.version?.admin)))
		)
	}
	static getConfigurations(
		configurations: ("admin" | "basic" | "bearer" | "public")[],
		permissions: Permissions
	): Api.Identity.Configuration<Identity>[] {
		return configurations.map(configuration => configurations[configuration])
	}
}
export namespace Identity {
	export const { type, is, flawed } = isly.instance<Identity>(Identity, "model.Identity").bind()
	export const configurations: Record<"admin" | "basic" | "bearer" | "public", Api.Identity.Configuration<Identity>> = {
		admin: {
			name: "",
			description: "",
			header: {
				name: "Authorization",
				type: isly.string().rename("Admin authentication").describe("Admin authentication"),
			},
			authenticate: async (token: string): Promise<Identity | undefined> =>
				token ? new Identity(token, {}) : undefined,
			type: Identity.type,
		},
		basic: {
			name: "",
			description: "",
			header: {
				name: "Authorization",
				type: isly.string().rename("Basic Authorization").describe("Basic login using username and password."),
			},
			authenticate: async (token: string): Promise<Identity | undefined> =>
				token ? new Identity(token, {}) : undefined,
			type: Identity.type,
		},
		bearer: {
			name: "",
			description: "",
			header: {
				name: "Authorization",
				type: isly.string().rename("Bearer Authorization").describe("Bearer authentication for API access."),
			},
			authenticate: async (token: string): Promise<Identity | undefined> =>
				token ? new Identity(token, {}) : undefined,
			type: Identity.type,
		},
		public: {
			name: "",
			description: "",
			header: { name: "Authorization", type: isly.string().describe("Bearer authentication for API access.") },
			authenticate: async (token: string): Promise<Identity | undefined> =>
				token ? new Identity(token, {}) : undefined,
			type: Identity.type,
		},
	}
}
