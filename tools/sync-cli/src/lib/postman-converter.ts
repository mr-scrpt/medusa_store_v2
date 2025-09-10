import { convert } from "openapi-to-postmanv2";
import { config } from "../config.ts";

function addCustomizations(collection: any, email?: string, password?: string): any {
  console.log("🔧 Applying authentication customizations...");
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
                "  pm.globals.set(\"medusa_jwt_token\", res.token);",
                "  console.log(\"Global Medusa JWT token saved!\");",
                "} else if (res.user && res.user.api_token) {",
                "  pm.globals.set(\"medusa_jwt_token\", res.user.api_token);",
                "  console.log(\"Global Medusa API token saved!\");",
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
            raw: JSON.stringify({ email: "{{medusa_admin_email}}", password: "{{medusa_admin_password}}" }, null, 2),
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

  collection.auth = { type: "bearer", bearer: [{ key: "token", value: "{{medusa_jwt_token}}", type: "string" }] };
  collection.variable = [
    { key: "base_url", value: "http://localhost:9000" },
    { key: "medusa_admin_email", value: email || "" },
    { key: "medusa_admin_password", value: password || "" },
    { key: "apiKey", value: config.MEDUSA_API_KEY || "" }
  ];

  if (!collection.item) collection.item = [];
  collection.item.unshift(authFolder);

  return collection;
}

function addSetupRequests(collection: any): any {
  console.log("🔧 Adding setup requests to the collection...");

  if (!collection.item) {
    return collection;
  }

  collection.item.forEach((folder: any) => {
    if (!folder.item || folder.name === "Authentication (Custom)") return;

    let listRequest: any = null;
    let resourceUrlName: string | null = null;

    for (const item of folder.item) {
      if (item.request && item.request.method === 'GET' && item.request.url.path.length > 0) {
        const lastSegment = item.request.url.path[item.request.url.path.length - 1];
        if (lastSegment && !lastSegment.startsWith(':')) {
          listRequest = item;
          resourceUrlName = lastSegment;
          break;
        }
      }
    }

    if (!listRequest || !resourceUrlName) {
      return;
    }
    
    const resourceName = resourceUrlName.endsWith('s') ? resourceUrlName.slice(0, -1) : resourceUrlName;
    console.log(`  - Found list request for resource: \"${resourceName}\"`);

    const setupRequest = JSON.parse(JSON.stringify(listRequest));
    const variableName = `${resourceName}_id`;

    setupRequest.name = `Setup: Get and Save First ${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} ID`;
    setupRequest.event = [
      {
        listen: "test",
        script: {
          type: "text/javascript",
          exec: [
            'pm.test("Status code is 200", function () { pm.response.to.have.status(200); });',
            "const response = pm.response.json();",
            `const items = response.${resourceUrlName};`,
            "if (items && items.length > 0) {",
            `  const firstId = items[0].id;`,
            `  pm.collectionVariables.set("${variableName}", firstId);`,
            `  console.log("Saved ${variableName}:", firstId);`,
            "} else {",
            `  console.warn("Could not find any items for resource '${resourceName}' to set ID.");`,
            "}",
          ],
        },
      },
    ];

    folder.item.forEach((item: any) => {
      if (item.request && item.request.url.path) {
        const lastPathSegmentIndex = item.request.url.path.length - 1;
        if (item.request.url.path[lastPathSegmentIndex]?.startsWith(':')) {
            console.log(`  - Updating request \"${item.name}\" to use {{${variableName}}}`);
            item.request.url.path[lastPathSegmentIndex] = `{{${variableName}}}`;
            if(item.request.url.raw) {
                const rawUrlParts = item.request.url.raw.split('/');
                rawUrlParts[rawUrlParts.length -1] = `{{${variableName}}}`;
                item.request.url.raw = rawUrlParts.join('/');
            }
        }
      }
    });

    folder.item.unshift(setupRequest);
  });

  return collection;
}

function normalizeRequestUrls(collection: any): any {
  function traverseItems(item: any) {
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

function cleanGeneratedRequests(items: any[] | undefined) {
  if (!items || !Array.isArray(items)) return;
  items.forEach(item => {
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

export async function generateCleanCollection(spec: any): Promise<any> {
  console.log("🔄 Converting OpenAPI spec to Postman collection...");
  const converterOptions = { disableOptionalParameters: true, folderStrategy: 'Tags' as const };
  
  const conversionResult = await new Promise<any>((resolve, reject) => {
    convert({ type: "json", data: spec }, converterOptions, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

  if (!conversionResult.result) {
    throw new Error(`Postman conversion failed: ${conversionResult.reason}`);
  }

  let finalCollection = conversionResult.output[0].data;
  
  finalCollection = addCustomizations(finalCollection, config.MEDUSA_ADMIN_EMAIL, config.MEDUSA_ADMIN_PASSWORD);
  finalCollection = normalizeRequestUrls(finalCollection);

  console.log("🧼 Cleaning up generated requests (auth & query params)...");
  cleanGeneratedRequests(finalCollection.item);

  // Добавляем новую логику для setup-запросов
  finalCollection = addSetupRequests(finalCollection);

  console.log("✅ Collection generated and customized successfully.");
  return finalCollection;
}
