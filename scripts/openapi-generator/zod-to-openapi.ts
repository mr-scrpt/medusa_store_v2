import { ts, Node } from "ts-morph";

export function zodAstToOpenApi(node: Node): object {
  // Обрабатываем прямые ссылки на другие схемы (например, attributeData: AttributeCreateSchema)
  if (Node.isIdentifier(node)) {
    const definition = node.getDefinitions()[0]?.getDeclarationNode();
    if (definition && Node.isVariableDeclaration(definition)) {
      const initializer = definition.getInitializer();
      if (initializer) return zodAstToOpenApi(initializer);
    }
  }

  if (Node.isCallExpression(node)) {
    const expressionText = node.getText();

    // Проверяем, с чего начинается цепочка вызовов. Это надежно работает.
    if (
      expressionText.startsWith("z.string") ||
      expressionText.startsWith("jsonString")
    )
      return { type: "string" };
    if (expressionText.startsWith("z.boolean")) return { type: "boolean" };
    if (expressionText.startsWith("z.number")) return { type: "number" };

    if (expressionText.startsWith("z.nativeEnum")) {
      const enumIdentifier = node
        .getArguments()[0]
        ?.asKind(ts.SyntaxKind.Identifier);
      const enumDeclaration = enumIdentifier
        ?.getDefinitions()[0]
        ?.getDeclarationNode()
        ?.asKind(ts.SyntaxKind.EnumDeclaration);
      if (enumDeclaration) {
        const enumMembers = enumDeclaration
          .getMembers()
          .map((member) =>
            member.getInitializer()?.getText().replace(/["']/g, ""),
          );
        return { type: "string", enum: enumMembers.filter(Boolean) };
      }
    }

    if (expressionText.startsWith("z.array")) {
      const itemNode = node.getArguments()[0];
      return { type: "array", items: zodAstToOpenApi(itemNode) };
    }

    if (expressionText.startsWith("z.object")) {
      const objNode = node
        .getArguments()[0]
        ?.asKind(ts.SyntaxKind.ObjectLiteralExpression);
      if (!objNode) return { type: "object" };
      const properties = {};
      const required: string[] = [];

      objNode.getProperties().forEach((prop) => {
        if (Node.isPropertyAssignment(prop)) {
          const name = prop.getName();
          const initializer = prop.getInitializer();
          if (initializer) {
            if (
              !initializer.getText().includes(".optional()") &&
              !initializer.getText().includes(".nullable()")
            ) {
              required.push(name);
            }
            properties[name] = zodAstToOpenApi(initializer);
          }
        }
      });
      return {
        type: "object",
        properties,
        ...(required.length > 0 && { required }),
      };
    }
  }

  // Запасной вариант, если тип определить не удалось
  return { type: "string", description: "Could not determine type" };
}
