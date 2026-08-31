import ts from 'typescript';

import { JSX_KINDS, scriptKind } from './complexity';

// File-level JSX detection: whether a file contains JSX *anywhere*, read from the AST rather than
// from the extension, which is an unreliable component-vs-logic signal here (./CONTEXT.md).
//
// This drives only the "does this file need vitest coverage generated" decision. Per-function
// `jsx`/`behavior` classification is a separate walk, in ./complexity.ts.

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
