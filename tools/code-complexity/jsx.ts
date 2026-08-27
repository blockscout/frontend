import ts from 'typescript';

import { scriptKind } from './complexity';

// JSX detection (spec FR4): whether a file contains JSX, read from the AST
// (JsxElement / JsxSelfClosingElement / JsxFragment) rather than its extension. ~78 non-test
// .tsx files contain no JSX (mostly `useX.tsx` hooks), so the extension is an unreliable
// component-vs-logic signal. JSX-less files are logic and get the coverage-aware CRAP gate;
// JSX-containing files get the complexity gate alone.

const JSX_KINDS: ReadonlySet<ts.SyntaxKind> = new Set([
  ts.SyntaxKind.JsxElement,
  ts.SyntaxKind.JsxSelfClosingElement,
  ts.SyntaxKind.JsxFragment,
]);

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
