//  postman/lib/postman-converter.js

const { convert } = require("openapi-to-postmanv2");
const config = require("../config");
function addCustomizations(collection, email, password) {
  console.log("🔧 Applying customizations...");
  const authFolder = {
    name: "Authentication (Custom)",
    item: [
      {
        name: "Admin: Login and Save Token",
        event: [
          {
            listen: "test",
            script: {
              type: "text/javascript",
              exec: [
                'pm.test("Status code is 200", function () { pm.response.to.have.status(200); });',
                "const res = pm.response.json();",
                "if (res.token) {",
                '  pm.globals.set("medusa_jwt_token", res.token);',
                '  console.log("Global Medusa JWT token saved!");',
                "} else if (res.user && res.user.api_token) {",
                '  pm.globals.set("medusa_jwt_token", res.user.api_token);',
                '  console.log("Global Medusa API token saved!");',
                "} else {",
                "  console.error(\"Could not find 'token' or 'api_token' in the response.\");",
                "}",
              ],
            },
          },
        ],
        request: {
          method: "POST",
          header: [{ key: "Content-Type", value: "application/json" }],
          body: {
            mode: "raw",
            raw: JSON.stringify(
              {
                email: "{{medusa_admin_email}}",
                password: "{{medusa_admin_password}}",
              },
              null,
              2,
            ),
          },
          url: {
            raw: "{{base_url}}/auth/user/emailpass",
            host: ["{{base_url}}"],
            path: ["auth", "user", "emailpass"],
          },
        },
      },
    ],
  };

  collection.auth = {
    type: "bearer",
    bearer: [{ key: "token", value: "{{medusa_jwt_token}}", type: "string" }],
  };
  collection.variable = [
    { key: "base_url", value: "http://localhost:9000" },
    { key: "medusa_admin_email", value: email || "" },
    { key: "medusa_admin_password", value: password || "" },
    { key: "apiKey", value: process.env.MEDUSA_API_KEY || "" },
  ];

  if (!collection.item) collection.item = [];
  collection.item.unshift(authFolder);

  return collection;
}

function normalizeRequestUrls(collection) {
  function traverseItems(item) {
    if (item.item && Array.isArray(item.item)) {
      item.item.forEach(traverseItems);
    } else if (item.request && item.request.url) {
      item.request.url.host = ["{{base_url}}"];
      delete item.request.url.protocol;
    }
  }
  if (collection.item) {
    traverseItems({ item: collection.item });
  }
  return collection;
}

function cleanGeneratedRequests(items) {
  if (!items || !Array.isArray(items)) {
    return;
  }
  items.forEach((item) => {
    if (item.request) {
      delete item.request.auth;

      if (item.request.url && item.request.url.query) {
        item.request.url.query = [];
      }
    }

    if (item.item) {
      cleanGeneratedRequests(item.item);
    }
  });
}

async function generateCleanCollection(spec) {
  console.log("🔄 Converting OpenAPI spec to Postman collection...");
  const converterOptions = {
    disableOptionalParameters: true,
    folderStrategy: "Tags",
  };
  const conversionResult = await new Promise((resolve, reject) => {
    convert({ type: "json", data: spec }, converterOptions, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

  if (!conversionResult.result) {
    throw new Error(`Postman conversion failed: ${conversionResult.reason}`);
  }

  let finalCollection = conversionResult.output[0].data;

  finalCollection = addCustomizations(
    finalCollection,
    config.MEDUSA_ADMIN_EMAIL,
    config.MEDUSA_ADMIN_PASSWORD,
  );

  finalCollection = normalizeRequestUrls(finalCollection);

  console.log("🧼 Cleaning up generated requests (auth & query params)...");
  cleanGeneratedRequests(finalCollection.item);

  console.log("✅ Collection generated and cleaned successfully.");
  return finalCollection;
}

module.exports = { generateCleanCollection };

