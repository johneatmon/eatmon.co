import hyphenopoly from "hyphenopoly"
import { readFileSync } from "node:fs"
import { dirname } from "path"
import { visit } from "unist-util-visit"
import { fileURLToPath } from "url"

function loaderSync(file) {
	const cwd = dirname(fileURLToPath(import.meta.url))
	return readFileSync(`${cwd}/../node_modules/hyphenopoly/patterns/${file}`)
}

const hyphenator = hyphenopoly.config({
	exceptions: {
		"en-us": "Astro",
	},
	loaderSync,
	require: ["en-us"],
	defaultLanguage: "en-us",
	sync: true,
})

export function remarkHyphenate() {
	function transformer(tree) {
		visit(tree, "text", function (node) {
			const hyphenated = hyphenator(node.value)

			node.value = hyphenated
		})
	}

	return transformer
}
