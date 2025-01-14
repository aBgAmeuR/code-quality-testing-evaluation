module.exports = {
	ci: {
		collect: {
			startServerCommand: "npm run start",
			url: [
				"http://localhost:3000",
			],
			settings: {
				chromeFlags: "--no-sandbox",
				locale: "fr-FR",
				onlyCategories: [
					"performance",
					"accessibility",
					"best-practices",
					"seo",
					"pwa",
				],
			},
		},
	},
}
