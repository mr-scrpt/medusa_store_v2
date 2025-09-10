import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";
import { globSync } from "glob";
import {
  Project,
  ts,
  Node,
} from "ts-morph";
import { zodAstToOpenApi } from "./zod-to-openapi.ts";
import { findZodSchemaDeclaration } from "./ts-morph-helpers.ts";

const ENDPOINT_FILES_PATTERN = "src/modules/**/endpoint.api.ts";
const OUTPUT_FILE_PATH = "postman/openapi.full.yaml";

export async function generateFullSpec() {
  console.log("🚀 Starting OpenAPI generation via Static Analysis...");

  const project = new Project({ tsConfigFilePath: "./tsconfig.json" });
  const paths = {};
  const allSchemas = {};
  const allTags = new Set<string>();

  const endpointFiles = globSync(ENDPOINT_FILES_PATTERN, { absolute: true });
  console.log(`📄 Found ${endpointFiles.length} endpoint definition file(s).`);

  for (const filePath of endpointFiles) {
    const sourceFile = project.addSourceFileAtPath(filePath);
    const moduleName = path.basename(path.dirname(path.dirname(filePath)));
    const tagName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
    allTags.add(tagName);

    console.log(`
🔎 Processing module: ${moduleName}`);
    const apiObject = sourceFile
      .getVariableDeclaration(`${moduleName}Api`)
      ?.getInitializerIfKind(ts.SyntaxKind.ObjectLiteralExpression);
    if (!apiObject) continue;
    console.log(`  - Found API object: "${moduleName}Api"`);

    const routeSourceFile = project.addSourceFileAtPath(
      filePath.replace("endpoint.api.ts", "route.api.ts"),
    );
    const routeDeclaration = routeSourceFile.getVariableDeclarationOrThrow(
      `API_${moduleName.toUpperCase()}_ENDPOINT`,
    );
    let routeInitializer = routeDeclaration.getInitializer();
    if (routeInitializer && Node.isAsExpression(routeInitializer)) {
      routeInitializer = routeInitializer.getExpression();
    }
    const routeObject = routeInitializer?.asKindOrThrow(
      ts.SyntaxKind.ObjectLiteralExpression,
    );
    const baseInitializer = routeObject
      .getPropertyOrThrow("BASE")
      .asKindOrThrow(ts.SyntaxKind.PropertyAssignment)
      .getInitializerOrThrow();
    const baseUrl = baseInitializer
      .asKind(ts.SyntaxKind.Identifier)
      ?.getDefinitions()[0]
      .getDeclarationNode()
      .getInitializer()
      .getText()
      .replace(/[\"']/g, "");

    for (const methodProp of apiObject.getProperties()) {
      if (!Node.isPropertyAssignment(methodProp)) continue;
      const methodName = methodProp.getName();
      console.log(`    - Processing method: "${methodName}"`);

      const methodInitializer = methodProp.getInitializerIfKindOrThrow(
        ts.SyntaxKind.ArrowFunction,
      );
      const fetchCall = methodInitializer.getFirstDescendantByKind(
        ts.SyntaxKind.CallExpression,
      );
      if (!fetchCall) continue;

      const fetchOptions = fetchCall
        .getArguments()[1]
        ?.asKind(ts.SyntaxKind.ObjectLiteralExpression);
      const httpMethod = fetchOptions
        ?.getProperty("method")
        ?.getInitializer()
        ?.getText()
        .replace(/[\'"`]/g, "")
        .toLowerCase();
      const urlNodeText = fetchCall.getArguments()[0].getText();
      let urlPath = baseUrl;
      if (
        urlNodeText.includes("GET_BY_ID") ||
        urlNodeText.includes("UPDATE") ||
        urlNodeText.includes("DELETE")
      ) {
        urlPath += `/{id}`;
      }
      if (!httpMethod || !urlPath) continue;
      console.log(
        `      - Found Route: ${httpMethod.toUpperCase()} ${urlPath}`,
      );

      const pathDefinition: any = {
        summary: `${methodName} ${tagName}`,
        tags: [tagName],
        responses: { "200": { description: "OK" } },
      };

      const dataParam = methodInitializer
        .getParameters()
        .find((p) => p.getName() === "data");
      if (dataParam) {
        const paramTypeNode = dataParam.getTypeNode();
        if (paramTypeNode) {
          const paramTypeName = paramTypeNode.getText();
          const typeAlias = project
            .getSourceFiles()
            .flatMap((sf) => sf.getTypeAlias(paramTypeName))
            .find((ta) => ta);
          if (typeAlias) {
            const schemaDefinition = findZodSchemaDeclaration(typeAlias);
            if (schemaDefinition) {
              const schemaName = schemaDefinition.getName();
              const initializer = schemaDefinition.getInitializer();
              if (initializer) {
                const openApiSchema = zodAstToOpenApi(initializer);
                allSchemas[schemaName] = openApiSchema;
                pathDefinition.requestBody = {
                  required: true,
                  content: {
                    "application/json": {
                      schema: { $ref: `#/components/schemas/${schemaName}` },
                    },
                  },
                };
              }
            }
          }
        }
      }
      if (!paths[urlPath]) paths[urlPath] = {};
      paths[urlPath][httpMethod] = pathDefinition;
    }
  }

  const openApiDocument = {
    openapi: "3.0.0",
    info: { title: "Medusa Custom API (Auto-Generated)", version: "1.0.0" },
    tags: Array.from(allTags).map((name) => ({
      name,
      description: `Operations for ${name}`,
    })),
    paths,
    components: { schemas: allSchemas },
  };

  const yamlSpec = yaml.dump(openApiDocument);
  await fs.writeFile(OUTPUT_FILE_PATH, yamlSpec);
  console.log(
    `
✅ Full spec file generated successfully at: ${OUTPUT_FILE_PATH}`,
  );
}
