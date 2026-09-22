import type { Config } from "prettier"

const config: Config = {
  semi: false,
  singleQuote: false,
  trailingComma: "none",
  printWidth: 120,
  tabWidth: 2,
  arrowParens: "avoid",
  useTabs: false,
  overrides: [
    {
      files: ["slides.md", "pages/**/*.md"],
      options: {
        parser: "slidev",
        plugins: ["prettier-plugin-slidev"]
      }
    }
  ]
}

export default config
