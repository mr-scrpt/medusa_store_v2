export function addSetupRequests(collection: any): any {
  console.log("🔧 Adding setup requests to the collection...");

  if (!collection.item) {
    return collection;
  }

  collection.item.forEach((folder: any) => {
    if (!folder.item || folder.name === "Authentication (Custom)") return;

    let listRequest: any = null;
    let resourceUrlName: string | null = null;

    for (const item of folder.item) {
      if (
        item.request &&
        item.request.method === "GET" &&
        item.request.url.path.length > 0
      ) {
        const lastSegment = 
          item.request.url.path[item.request.url.path.length - 1];
        if (lastSegment && !lastSegment.startsWith(":")) {
          listRequest = item;
          resourceUrlName = lastSegment;
          break;
        }
      }
    }

    if (!listRequest || !resourceUrlName) {
      return;
    }

    const resourceName = resourceUrlName.endsWith("s")
      ? resourceUrlName.slice(0, -1)
      : resourceUrlName;
    console.log(`  - Found list request for resource: "${resourceName}".`);

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
        if (item.request.url.path[lastPathSegmentIndex]?.startsWith(":")) {
          console.log(
            `  - Updating request "${item.name}" to use {{${variableName}}} `,
          );
          item.request.url.path[lastPathSegmentIndex] = `{{${variableName}}}`;
          if (item.request.url.raw) {
            const rawUrlParts = item.request.url.raw.split("/");
            rawUrlParts[rawUrlParts.length - 1] = `{{${variableName}}}`;
            item.request.url.raw = rawUrlParts.join("/");
          }
        }
      }
    });

    folder.item.unshift(setupRequest);
  });

  return collection;
}
