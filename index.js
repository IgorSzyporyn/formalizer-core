"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./core.cjs.production.js");
} else {
  module.exports = require("./core.cjs.development.js");
}
