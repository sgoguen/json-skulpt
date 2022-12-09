import * as ts from "typescript";

export function getAST(source: string) {
  const sourceFile = ts.createSourceFile(
    "test.ts",
    source,
    ts.ScriptTarget.ES2015,
    true,
    ts.ScriptKind.TS
  );

  // Add an ID to every node in the tree to make it easier to identify in
  // the consuming application.
  let nextId = 0;
  function addId(node: ts.Node & { id?: number }) {
    nextId++;
    node.id = nextId;
    ts.forEachChild(node, addId);

    return node;
  }
  const fixedSource = addId(sourceFile);

  const cache = new Set<object>();
  const interfaces = new Map<string, InterfaceInfo>();
  const tsJson = JSON.stringify(
    fixedSource,
    (key, value: any) => {
      // Discard the following.
      if (
        key === "flags" ||
        key === "transformFlags" ||
        key === "modifierFlagsCache"
      ) {
        return;
      }

      // Replace 'kind' with the string representation.
      if (key === "kind") {
        value = ts.SyntaxKind[value];
      }

      if (typeof value === "object" && value !== null) {
        // Duplicate reference found, discard key
        if (cache.has(value)) return;

        cache.add(value);
      }
      return value;
    },
    2
  );

  return JSON.parse(tsJson);
}

interface InterfaceInfo {
  name: string;
  members: Method | Property;
}
interface Method {}

interface Property {}
