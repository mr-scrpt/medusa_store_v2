//  postman/config.js

require("dotenv").config();

module.exports = {
  
  MEDUSA_ADMIN_OAS_URL: "https://raw.githubusercontent.com/medusajs/medusa/639ecdfd7439fb45445022f0a850580550c5a633/www/apps/api-reference/specs/admin/openapi.full.yaml",
  CUSTOM_SPECS_PATTERN: "src/**/*.oas.yaml",
  OUTPUT_FILE_PATH: "postman/output/postman_collection.json",
  
  
  POSTMAN_API_KEY: process.env.POSTMAN_API_KEY,
  POSTMAN_COLLECTION_ID: process.env.POSTMAN_COLLECTION_ID,
  MEDUSA_ADMIN_EMAIL: process.env.MEDUSA_ADMIN_EMAIL,
  MEDUSA_ADMIN_PASSWORD: process.env.MEDUSA_ADMIN_PASSWORD,

  MEDUSA_API_KEY: process.env.MEDUSA_API_KEY, 
};
