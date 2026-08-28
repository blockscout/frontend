import ts from 'typescript';

// Per-function complexity from a single walk of the syntax tree produced by ts.createSourceFile
// (no type-checker). Two scores accrue on the *same* walk:
//
//  - `complexity` — cyclomatic complexity, counting independent paths ≈ tests needed. It mirrors
//    ESLint's `complexity` rule (bar optional chaining, ADR 0004) and feeds CRAP. It is no longer a
//    gate on its own — see ./CONTEXT.md.
//  - `cognitive` — Cognitive Complexity (SonarSource model), the readability gate. Flat control flow
//    scores cheap, nesting is penalised progressively, boolean runs collapse. Every increment is
//    recorded in `contributions` so a violation can name the exact sites that cost the most.
//
// The exact conventions and the divergences from SonarSource are documented in ./CONTEXT.md.

export interface Contribution {
  // Line of the construct that added the increment (1-based).
  readonly line: number;
  // Cognitive-complexity points this construct added.
  readonly amount: number;
  // Human-readable construct name, surfaced in violation annotations.
  readonly reason: string;
  // Nesting depth this construct sits at (0 = function top level). Nesting structures pay
  // `1 + nesting`; flat ones pay a fixed amount at whatever depth they occur. Used to locate the
  // deepest pocket for the "flatten this" annotation.
  readonly nesting: number;
}

export interface FunctionComplexity {
  name: string;
  // 1-based inclusive line range of the whole function node, used by diff-scoping to decide
  // whether a changed line falls within the function.
  startLine: number;
  endLine: number;
  // Cyclomatic complexity — the CRAP input. Never gated directly.
  complexity: number;
  // Cognitive complexity — the readability gate.
  cognitive: number;
  // Every cognitive increment, in walk order. Empty when `cognitive` is 0.
  contributions: Array<Contribution>;
  // Whether JSX appears directly in this function's own body — outside any nested function. This
  // classifies the function `jsx` vs `behavior` (see ./CONTEXT.md), which selects its cognitive cap
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
// compound-assignment forms. ESLint's `complexity` rule counts all of these toward cyclomatic.
const LOGICAL_OPERATORS: ReadonlySet<ts.SyntaxKind> = new Set([
  ts.SyntaxKind.AmpersandAmpersandToken,
  ts.SyntaxKind.BarBarToken,
  ts.SyntaxKind.QuestionQuestionToken,
  ts.SyntaxKind.AmpersandAmpersandEqualsToken,
  ts.SyntaxKind.BarBarEqualsToken,
  ts.SyntaxKind.QuestionQuestionEqualsToken,
]);

// The expression-level logical operators that form cognitive "boolean sequences": a run of the same
// operator costs +1 for the whole run, and switching operator starts a new run. Compound-assignment
// forms are not sequence operators (they are statements, not chains).
const SEQUENCE_OPERATORS: ReadonlyMap<ts.SyntaxKind, string> = new Map([
  [ ts.SyntaxKind.AmpersandAmpersandToken, '&&' ],
  [ ts.SyntaxKind.BarBarToken, '||' ],
  [ ts.SyntaxKind.QuestionQuestionToken, '??' ],
]);

// Cognitive-complexity reasons whose increment carries the nesting penalty (`1 + nesting`). Used to
// estimate how much flattening the deepest pocket would save (each such increment there drops by 1).
const NESTING_STRUCTURE_REASONS: ReadonlySet<string> = new Set([
  'if', 'ternary', 'catch', 'switch', 'for loop', 'for-in loop', 'for-of loop', 'while loop', 'do-while loop',
]);

export function isNestingStructureReason(reason: string): boolean {
  return NESTING_STRUCTURE_REASONS.has(reason);
}

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

const LOOP_REASONS: ReadonlyMap<ts.SyntaxKind, string> = new Map([
  [ ts.SyntaxKind.ForStatement, 'for loop' ],
  [ ts.SyntaxKind.ForInStatement, 'for-in loop' ],
  [ ts.SyntaxKind.ForOfStatement, 'for-of loop' ],
  [ ts.SyntaxKind.WhileStatement, 'while loop' ],
  [ ts.SyntaxKind.DoStatement, 'do-while loop' ],
]);

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

// The bare identifier a function calls to recur on itself, when it has one. Recursion is detected by
// name match only (no type-checker): a call whose callee is this identifier is direct self-recursion.
// Methods/`this.x()` and destructured/aliased calls are not caught — a documented approximation.
function selfCallName(node: ts.Node): string | undefined {
  if (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) {
    if (node.name) return node.name.text;
  }
  if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
    const parent = node.parent;
    if (parent && ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) {
      return parent.name.text;
    }
  }
  return undefined;
}

export function scriptKind(fileName: string): ts.ScriptKind {
  return fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
}

interface Frame {
  readonly node: ts.Node;
  readonly selfName: string | undefined;
  complexity: number;
  cognitive: number;
  containsJsx: boolean;
  readonly contributions: Array<Contribution>;
}

function isElseIf(node: ts.IfStatement): boolean {
  const parent = node.parent;
  return parent !== undefined && ts.isIfStatement(parent) && parent.elseStatement === node;
}

export function computeFunctionComplexities(sourceText: string, fileName: string): Array<FunctionComplexity> {
  const sourceFile = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, true, scriptKind(fileName));
  const results: Array<FunctionComplexity> = [];

  const lineOf = (pos: number): number => sourceFile.getLineAndCharacterOfPosition(pos).line + 1;

  const add = (frame: Frame, node: ts.Node, amount: number, reason: string, nesting: number): void => {
    frame.cognitive += amount;
    frame.contributions.push({ line: lineOf(node.getStart(sourceFile)), amount, reason, nesting });
  };

  const recurse = (node: ts.Node, frame: Frame | null, nesting: number): void =>
    ts.forEachChild(node, (child) => visit(child, frame, nesting));

  // Cyclomatic, JSX classification, recursion and labelled-jump increments apply to every node
  // identically, however the node is reached. Cognitive nesting-structure increments are applied by
  // the per-kind traversal below, because they depend on `nesting` and on how children are descended.
  const applyUniversal = (node: ts.Node, frame: Frame, nesting: number): void => {
    if (countsAsBranch(node)) frame.complexity += 1;
    if (JSX_KINDS.has(node.kind)) frame.containsJsx = true;

    if (ts.isBinaryExpression(node)) {
      const operator = SEQUENCE_OPERATORS.get(node.operatorToken.kind);
      if (operator !== undefined) {
        // A run of like operators costs +1 once; a different operator (or any non-logical parent,
        // e.g. parentheses) starts a fresh run. `a && b && c` = +1; `a && b || c` = +2.
        const parent = node.parent;
        const continuesRun = parent !== undefined && ts.isBinaryExpression(parent) &&
          parent.operatorToken.kind === node.operatorToken.kind;
        if (!continuesRun) add(frame, node, 1, `logical sequence (${ operator })`, nesting);
      }
    }

    if ((ts.isBreakStatement(node) || ts.isContinueStatement(node)) && node.label) {
      add(frame, node, 1, ts.isBreakStatement(node) ? 'labelled break' : 'labelled continue', nesting);
    }

    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) &&
      frame.selfName !== undefined && node.expression.text === frame.selfName) {
      add(frame, node, 1, 'recursion', nesting);
    }
  };

  const visit = (node: ts.Node, frame: Frame | null, nesting: number): void => {
    if (FUNCTION_KINDS.has(node.kind)) {
      // Every function is its own unit: nesting resets to 0 and branches accrue only to it. A nested
      // function is a separate frame, so its body never counts toward the enclosing one.
      const inner: Frame = {
        node,
        selfName: selfCallName(node),
        complexity: 1,
        cognitive: 0,
        containsJsx: false,
        contributions: [],
      };
      recurse(node, inner, 0);
      results.push({
        name: inferName(node),
        startLine: lineOf(node.getStart(sourceFile)),
        endLine: lineOf(node.getEnd()),
        complexity: inner.complexity,
        cognitive: inner.cognitive,
        contributions: inner.contributions,
        containsJsx: inner.containsJsx,
      });
      return;
    }

    // Constructs at module scope belong to no function and are ignored (only nested functions matter),
    // matching ESLint's per-function reporting.
    if (frame === null) {
      recurse(node, null, nesting);
      return;
    }

    applyUniversal(node, frame, nesting);

    if (ts.isIfStatement(node)) {
      // `else if` (an if that is its parent's else branch) is a flat continuation: +1, no nesting
      // penalty, and the chain stays at the same base level. A leading `if` pays `1 + nesting`.
      if (isElseIf(node)) add(frame, node, 1, 'else if', nesting);
      else add(frame, node, 1 + nesting, 'if', nesting);
      visit(node.expression, frame, nesting);
      visit(node.thenStatement, frame, nesting + 1);
      if (node.elseStatement) {
        if (ts.isIfStatement(node.elseStatement)) {
          visit(node.elseStatement, frame, nesting); // else-if handled as its own continuation
        } else {
          // A bare `else` costs +1 with no nesting penalty; its body nests one level deeper.
          add(frame, node.elseStatement, 1, 'else', nesting);
          visit(node.elseStatement, frame, nesting + 1);
        }
      }
      return;
    }

    if (ts.isConditionalExpression(node)) {
      add(frame, node, 1 + nesting, 'ternary', nesting);
      visit(node.condition, frame, nesting);
      visit(node.whenTrue, frame, nesting + 1);
      visit(node.whenFalse, frame, nesting + 1);
      return;
    }

    const loopReason = LOOP_REASONS.get(node.kind);
    if (loopReason !== undefined) {
      add(frame, node, 1 + nesting, loopReason, nesting);
      // Only the loop body nests; the header (init/condition/update) stays at the current level.
      ts.forEachChild(node, (child) => visit(child, frame, child === (node as ts.IterationStatement).statement ? nesting + 1 : nesting));
      return;
    }

    if (ts.isCatchClause(node)) {
      add(frame, node, 1 + nesting, 'catch', nesting);
      if (node.variableDeclaration) visit(node.variableDeclaration, frame, nesting);
      visit(node.block, frame, nesting + 1);
      return;
    }

    if (ts.isSwitchStatement(node)) {
      // A switch is a nesting structure: one increment for the whole switch (never per-case, unlike
      // cyclomatic), carrying the `1 + nesting` penalty, and its body nests one level so control flow
      // inside a case is penalised for the depth. This is what makes deeply-nested switch trees (the
      // genuinely-hard-to-read tail this gate targets) score high.
      add(frame, node, 1 + nesting, 'switch', nesting);
      visit(node.expression, frame, nesting);
      visit(node.caseBlock, frame, nesting + 1);
      return;
    }

    recurse(node, frame, nesting);
  };

  visit(sourceFile, null, 0);
  return results;
}
