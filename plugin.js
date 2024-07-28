const parserMarkdown = require("prettier/parser-markdown")


const prettier = {
  parsers: {
    markdown: {
      ...parserMarkdown.parsers.markdown,
      preprocess(text) {
        return text.replace(/([\u4e00-\u9fa5])([a-zA-Z])/g, "$1 $2").replace(/([a-zA-Z])([\u4e00-\u9fa5])/g, "$1 $2")
      }
    }
  }
}

module.exports = prettier