// @ts-ignore
import * as parserMarkdown from "prettier/parser-markdown"

export default {
  parsers: {
    markdown: {
      ...parserMarkdown.parsers.markdown,
      preprocess(text: string) {
        return text.replace(/([\u4e00-\u9fa5])([a-zA-Z])/g, "$1 $2").replace(/([a-zA-Z])([\u4e00-\u9fa5])/g, "$1 $2")
      }
    }
  }
}
