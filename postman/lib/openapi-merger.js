//  postman/lib/openapi-merger.js
const fs = require("fs/promises");
const { globSync } = require("glob");
const axios = require("axios");
const yaml = require("js-yaml");
const merge = require("deepmerge");
const config = require("../config");

async function buildUnifiedSpec() {
  console.log("🚀 Building unified OpenAPI spec...");
  const { data: baseSpecYaml } = await axios.get(config.MEDUSA_ADMIN_OAS_URL);
  let mergedSpec = yaml.load(baseSpecYaml);

  const customSpecFiles = globSync(config.CUSTOM_SPECS_PATTERN);
  console.log(`📄 Found ${customSpecFiles.length} custom spec(s) to merge.`);
  for (const file of customSpecFiles) {
    const content = await fs.readFile(file, "utf-8");
    const customSpec = yaml.load(content);
    mergedSpec = merge(mergedSpec, customSpec);
  }

  // Функция injectLoginRequest отсюда убрана

  console.log("✅ Unified spec built successfully.");
  return mergedSpec;
}

module.exports = { buildUnifiedSpec };
