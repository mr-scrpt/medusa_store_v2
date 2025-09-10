import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";
import { globSync } from "glob";
import { Project, ts, Node, TypeAliasDeclaration, VariableDeclaration } from "ts-morph";
import { config } from "../config.ts";

// --- Вспомогательные функции для ts-morph ---
function findZodSchemaDeclaration(
  typeAlias: TypeAliasDeclaration,
): VariableDeclaration | undefined {
  let currentNode: Node | undefined = typeAlias;
  const visited = new Set<Node>();
  while (currentNode && !visited.has(currentNode)) {
    visited.add(currentNode);
    if (Node.isTypeAliasDeclaration(currentNode)) {
      const typeNode = currentNode.getTypeNode();
      const zodSchemaIdentifier = typeNode
        ?.getDescendantsOfKind(ts.SyntaxKind.Identifier)
        .find((i) => i.getText().endsWith("Schema"));
      if (zodSchemaIdentifier) {
        const schemaDefinition = zodSchemaIdentifier
          .getDefinitions()[0]
          ?.getDeclarationNode();
        if (schemaDefinition && Node.isVariableDeclaration(schemaDefinition)) {
          return schemaDefinition;
        }
      }
      const nextIdentifier = typeNode
        ?.asKind(ts.SyntaxKind.TypeReference)
        ?.getTypeName()
        .asKind(ts.SyntaxKind.Identifier);
      currentNode = nextIdentifier?.getDefinitions()[0]?.getDeclarationNode();
    } else {
      break;
    }
  }
  return undefined;
}

// --- Конвертер Zod в OpenAPI ---
function zodAstToOpenApi(node: Node): object {
  if (Node.isIdentifier(node)) {
    const definition = node.getDefinitions()[0]?.getDeclarationNode();
    if (definition && Node.isVariableDeclaration(definition)) {
      const initializer = definition.getInitializer();
      if (initializer) return zodAstToOpenApi(initializer);
    }
  }

  if (Node.isCallExpression(node)) {
    const expressionText = node.getText();
    if (expressionText.startsWith("z.string") || expressionText.startsWith("jsonString")) return { type: "string" };
    if (expressionText.startsWith("z.boolean")) return { type: "boolean" };
    if (expressionText.startsWith("z.number")) return { type: "number" };

    if (expressionText.startsWith("z.nativeEnum")) {
      const enumIdentifier = node.getArguments()[0]?.asKind(ts.SyntaxKind.Identifier);
      const enumDeclaration = enumIdentifier?.getDefinitions()[0]?.getDeclarationNode()?.asKind(ts.SyntaxKind.EnumDeclaration);
      if (enumDeclaration) {
        const enumMembers = enumDeclaration.getMembers().map((member) => member.getInitializer()?.getText().replace(/["']/g, ""));
        return { type: "string", enum: enumMembers.filter(Boolean) };
      }
    }

    if (expressionText.startsWith("z.array")) {
      const itemNode = node.getArguments()[0];
      return { type: "array", items: zodAstToOpenApi(itemNode) };
    }

    if (expressionText.startsWith("z.object")) {
      const objNode = node.getArguments()[0]?.asKind(ts.SyntaxKind.ObjectLiteralExpression);
      if (!objNode) return { type: "object" };
      const properties = {};
      const required: string[] = [];
      objNode.getProperties().forEach((prop) => {
        if (Node.isPropertyAssignment(prop)) {
          const name = prop.getName();
          const initializer = prop.getInitializer();
          if (initializer) {
            if (!initializer.getText().includes(".optional()") && !initializer.getText().includes(".nullable()")) {
              required.push(name);
            }
            properties[name] = zodAstToOpenApi(initializer);
          }
        }
      });
      return { type: "object", properties, ...(required.length > 0 && { required }) };
    }
  }
  return { type: "string", description: "Could not determine type" };
}

// --- Основная функция генерации ---
const ENDPOINT_FILES_PATTERN = "src/modules/**/endpoint.api.ts";

export async function generateLocalSpec(): Promise<any> {
  console.log("🚀 Starting OpenAPI generation from local source code...");

  const project = new Project({ tsConfigFilePath: "./tsconfig.json" });
  const paths = {};
  const allSchemas = {};
  const allTags = new Set<string>();

  const endpointFiles = globSync(ENDPOINT_FILES_PATTERN, { absolute: true });
  console.log(`📄 Found ${endpointFiles.length} endpoint definition file(s).`);

  for (const filePath of endpointFiles) {
    const sourceFile = project.addSourceFileAtPath(filePath);
    const moduleName = path.basename(path.dirname(path.dirname(filePath)));
    const tagName = `Custom ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
    allTags.add(tagName);

    console.log(`
🔎 Processing module: ${moduleName}`);
    const apiObject = sourceFile.getVariableDeclaration(`${moduleName}Api`)?.getInitializerIfKind(ts.SyntaxKind.ObjectLiteralExpression);
    if (!apiObject) continue;
    console.log(`  - Found API object: "${moduleName}Api"`);

    const routeSourceFile = project.addSourceFileAtPath(filePath.replace("endpoint.api.ts", "route.api.ts"));
    const routeDeclaration = routeSourceFile.getVariableDeclarationOrThrow(`API_${moduleName.toUpperCase()}_ENDPOINT`);
    let routeInitializer = routeDeclaration.getInitializer();
    if (routeInitializer && Node.isAsExpression(routeInitializer)) {
      routeInitializer = routeInitializer.getExpression();
    }
    const routeObject = routeInitializer?.asKindOrThrow(ts.SyntaxKind.ObjectLiteralExpression);
    const baseInitializer = routeObject.getPropertyOrThrow("BASE").asKindOrThrow(ts.SyntaxKind.PropertyAssignment).getInitializerOrThrow();
    const baseUrl = baseInitializer.asKind(ts.SyntaxKind.Identifier)?.getDefinitions()[0].getDeclarationNode().getInitializer().getText().replace(/[""]/g, "");

    const properties = apiObject.getProperties();
    console.log(`  - Found ${properties.length} properties from ts-morph: ${properties.map(p => p.getSymbol()?.getName()).join(', ')}`);

    for (const methodProp of properties) {
      if (!Node.isPropertyAssignment(methodProp)) continue;
      const methodName = methodProp.getName();
      
      console.log(`    - Processing method: "${methodName}"`);

      const methodInitializer = methodProp.getInitializerIfKindOrThrow(ts.SyntaxKind.ArrowFunction);
      const fetchCall = methodInitializer.getFirstDescendantByKind(ts.SyntaxKind.CallExpression);
      if (!fetchCall) {
        console.log(`      - ⚠️ Could not find fetch call for method: ${methodName}`);
        continue;
      }

      const fetchOptions = fetchCall.getArguments()[1]?.asKind(ts.SyntaxKind.ObjectLiteralExpression);
      let httpMethod = fetchOptions?.getProperty("method")?.getInitializer()?.getText().replace(/[\'"`]/g, "").toLowerCase();
      
      // ВАЖНОЕ ИСПРАВЛЕНИЕ: Если метод не указан, по умолчанию это GET
      if (!httpMethod) {
        httpMethod = 'get';
      }

      const urlNodeText = fetchCall.getArguments()[0].getText();
      let urlPath = baseUrl;
      // Простое сопоставление имени метода с ожидаемым поведением URL
      if (methodName === 'get' || methodName === 'update' || methodName === 'delete') {
        urlPath += `/{id}`;
      }

      if (!httpMethod || !urlPath) continue;

      const pathDefinition: any = { summary: `${methodName} ${tagName}`, tags: [tagName], responses: { "200": { description: "OK" } } };

      const dataParam = methodInitializer.getParameters().find((p) => p.getName() === "data");
      if (dataParam) {
        const paramTypeNode = dataParam.getTypeNode();
        if (paramTypeNode) {
          const paramTypeName = paramTypeNode.getText();
          const typeAlias = project.getSourceFiles().flatMap((sf) => sf.getTypeAlias(paramTypeName)).find((ta) => ta);
          if (typeAlias) {
            const schemaDefinition = findZodSchemaDeclaration(typeAlias);
            if (schemaDefinition) {
              const schemaName = schemaDefinition.getName();
              const initializer = schemaDefinition.getInitializer();
              if (initializer) {
                const openApiSchema = zodAstToOpenApi(initializer);
                allSchemas[schemaName] = openApiSchema;
                pathDefinition.requestBody = { required: true, content: { "application/json": { schema: { $ref: `#/components/schemas/${schemaName}` } } } };
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
    tags: Array.from(allTags).map((name) => ({ name, description: `Operations for ${name}` })),
    paths,
    components: { schemas: allSchemas },
  };

  const yamlSpec = yaml.dump(openApiDocument);
  await fs.writeFile(config.LOCAL_OPENAPI_OUTPUT_PATH, yamlSpec);
  console.log(`
✅ Local spec file generated successfully at: ${config.LOCAL_OPENAPI_OUTPUT_PATH}`);
  return openApiDocument;
}