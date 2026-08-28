import ts from 'typescript';

// Per-function cyclomatic complexity computed by walking the syntax tree produced by
// ts.createSourceFile (no type-checker). The counting mirrors ESLint's `complexity` rule so
// the gate agrees with what a developer sees from ESLint; the exact conventions are documented
// in ./CONTEXT.md.

export interface FunctionComplexity {
  name: string;
  // 1-based inclusive line range of the whole function node, used by diff-scoping to decide
  // whether a changed line falls within the function.
  startLine: number;
  endLine: number;
  complexity: number;
  // Whether JSX appears directly in this function's own body — outside any nested function. This
  // classifies the function `jsx` vs `behavior` (see ./CONTEXT.md), which selects its complexity cap
  // and whether the CRAP (coverage) gate applies to it. A `.map(x => <Row/>)` callback is `jsx`
  // (the JSX is in the callback's own body); an `onClick` handler that renders nothing is `behavior`.
  containsJsx: boolean;
}

// JSX node kinds that mark a function as directly containing JSX. Exported so ./jsx.ts (the
// file-level detector) shares one definition rather than keeping a parallel copy.
export const JSX_KINDS: ReadonlySet<ts.SyntaxKind> = new Set([
  ts.SyntaxKind.JsxElement,
  ts.SyntaxKind.JsxSelfClosingElement,
  ts.SyntaxKind.JsxFragment,
]);

const FUNCTION_KINDS: ReadonlySet<ts.SyntaxKind> = new Set([
  ts.SyntaxKind.FunctionDeclaration,
  ts.SyntaxKind.FunctionExpression,
  ts.SyntaxKind.ArrowFunction,
  ts.SyntaxKind.MethodDeclaration,
  ts.SyntaxKind.Constructor,
  ts.SyntaxKind.GetAccessor,
  ts.SyntaxKind.SetAccessor,
]);

// Binary operators that introduce a branch: the short-circuiting logical operators and their
// compound-assignment forms. ESLint's `complexity` rule counts all of these.
const LOGICAL_OPERATORS: ReadonlySet<ts.SyntaxKind> = new Set([
  ts.SyntaxKind.AmpersandAmpersandToken,
  ts.SyntaxKind.BarBarToken,
  ts.SyntaxKind.QuestionQuestionToken,
  ts.SyntaxKind.AmpersandAmpersandEqualsToken,
  ts.SyntaxKind.BarBarEqualsToken,
  ts.SyntaxKind.QuestionQuestionEqualsToken,
]);

function countsAsBranch(node: ts.Node): boolean {
  switch (node.kind) {
    case ts.SyntaxKind.IfStatement:
    case ts.SyntaxKind.ForStatement:
    case ts.SyntaxKind.ForInStatement:
    case ts.SyntaxKind.ForOfStatement:
    case ts.SyntaxKind.WhileStatement:
    case ts.SyntaxKind.DoStatement:
    case ts.SyntaxKind.CaseClause: // DefaultClause is intentionally not counted
    case ts.SyntaxKind.CatchClause:
    case ts.SyntaxKind.ConditionalExpression: // ternary
      return true;
    case ts.SyntaxKind.BinaryExpression:
      return LOGICAL_OPERATORS.has((node as ts.BinaryExpression).operatorToken.kind);
    // Optional chaining `?.` is deliberately NOT counted. It short-circuits, but TypeScript already
    // proves the nullability at each `?.` site, so no unit test needs an extra case for it — counting
    // it measures null-safety verbosity, not the branching risk CRAP is meant to flag (ADR 0004).
    default:
      return false;
  }
}

function inferName(node: ts.Node): string {
  if (ts.isFunctionDeclaration(node)) {
    return node.name?.text ?? '<anonymous>';
  }
  if (ts.isConstructorDeclaration(node)) {
    return 'constructor';
  }
  if (ts.isMethodDeclaration(node) || ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node)) {
    const base = node.name.getText();
    if (ts.isGetAccessorDeclaration(node)) return `get ${ base }`;
    if (ts.isSetAccessorDeclaration(node)) return `set ${ base }`;
    return base;
  }
  if (ts.isFunctionExpression(node) && node.name) {
    return node.name.text;
  }
  // Arrow functions and anonymous function expressions: recover a name from the binding context.
  const parent = node.parent;
  if (parent) {
    if (ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) {
      return parent.name.text;
    }
    if (ts.isPropertyDeclaration(parent) || ts.isPropertyAssignment(parent)) {
      return parent.name.getText();
    }
    if (ts.isBinaryExpression(parent) && parent.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
      return parent.left.getText();
    }
  }
  return '<anonymous>';
}

export function scriptKind(fileName: string): ts.ScriptKind {
  return fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
}

export function computeFunctionComplexities(sourceText: string, fileName: string): Array<FunctionComplexity> {
  const sourceFile = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, true, scriptKind(fileName));
  const results: Array<FunctionComplexity> = [];
  const stack: Array<{ node: ts.Node; complexity: number; containsJsx: boolean }> = [];

  const lineOf = (pos: number): number => sourceFile.getLineAndCharacterOfPosition(pos).line + 1;

  const visit = (node: ts.Node): void => {
    const isFunction = FUNCTION_KINDS.has(node.kind);
    if (isFunction) {
      stack.push({ node, complexity: 1, containsJsx: false });
    } else if (stack.length > 0) {
      const innermost = stack[stack.length - 1];
      // A branch counts toward the innermost enclosing function; constructs at module scope
      // belong to no function and are ignored, matching ESLint's per-function reporting.
      if (countsAsBranch(node)) innermost.complexity += 1;
      // JSX marks only the innermost frame, which is by construction the function whose own body
      // holds it (a nested function would itself be innermost) — so this is "directly contains JSX".
      if (JSX_KINDS.has(node.kind)) innermost.containsJsx = true;
    }

    ts.forEachChild(node, visit);

    if (isFunction) {
      const frame = stack.pop();
      if (frame) {
        results.push({
          name: inferName(node),
          startLine: lineOf(node.getStart(sourceFile)),
          endLine: lineOf(node.getEnd()),
          complexity: frame.complexity,
          containsJsx: frame.containsJsx,
        });
      }
    }
  };

  visit(sourceFile);
  return results;
}
