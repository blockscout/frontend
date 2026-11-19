import ts from 'typescript';

import { JSX_KINDS, scriptKind } from './complexity';

// Read from the AST rather than from the extension, which is an unreliable component-vs-logic signal
// here. The per-function alternative: ./complexity.ts.

export function fileContainsJsx(sourceText: string, fileName: string): boolean {
  const sourceFile = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, true, scriptKind(fileName));

  let found = false;
  const visit = (node: ts.Node): void => {
    if (found) return;
    if (JSX_KINDS.has(node.kind)) {
      found = true;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  return found;
}
