import { ts, Node, TypeAliasDeclaration, VariableDeclaration } from "ts-morph";

export function findZodSchemaDeclaration(
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
