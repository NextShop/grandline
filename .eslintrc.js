module.exports = {
  extends: ["airbnb-typescript/base"],
  rules: {
    "no-restricted-syntax": "warn",
    "no-underscore-dangle" : "off",
    "keyword-spacing" : "off",
    "no-use-before-define": ["error", { "variables": false }],
    "import/prefer-default-export": "off",
    "class-methods-use-this": "off",
    "no-await-in-loop": "off"
  }
}