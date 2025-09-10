import { config } from "../../config.ts";

export function addCustomizations(
  collection: any,
  email?: string,
  password?: string,
): any {
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
    { key: "apiKey", value: config.MEDUSA_API_KEY || "" },
  ];

  if (!collection.item) collection.item = [];
  collection.item.unshift(authFolder);

  return collection;
}
