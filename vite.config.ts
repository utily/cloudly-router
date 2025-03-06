import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		typecheck: { tsconfig: "./tsconfig.json" },
		coverage: {
			reporter: ["text", "json", "html"],
			enabled: false,
			all: true,
			cleanOnRerun: true,
			thresholds: { statements: 35, branches: 80, functions: 50, lines: 35 },
		},
		globals: true,
		include: ["**/*.spec.[tj]s"],
		testTimeout: 20000,
		isolate: false,
		exclude: ["node_modules", "dist"],
		server: { deps: { inline: ["cloudly-http", "gracely", "isly", "typedly"] } },
	},
})
