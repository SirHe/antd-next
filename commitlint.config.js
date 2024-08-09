module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-max-line-length": [0, "always", 0] // 禁用 body-max-line-length 规则
  }
}
