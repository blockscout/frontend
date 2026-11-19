const MAX_PROSE_LINES = 8;
const COMMENTS_RULE = '.agents/rules/code-quality.md → "Comments"';

const EXEMPT_COMMENTS = [
  /^[\s*]*(?:@ts-|\/\s*<(?:reference|amd-))/,
  /^[\s*]*(?:@vitest-environment\b|Stryker\s+(?:disable|restore)\b)/,
  /SPDX-License-Identifier|@license\b/,
];
const DIRECTIVE_JUSTIFICATION = /\s-{2,}\s/;
const BINDING_DIRECTIVE = /^(?:globals?|exported)(?:\s|$)/;
const BINDING_LIST = /^(?:globals?|exported)(?:[\s,]+[\p{L}\p{N}_$]+(?:\s*:\s*[a-z]+)?)*[\s,]*$/u;
const TYPE_ANNOTATION = /^\*\s*@type\b/;
const JAVASCRIPT_FILE = /\.(?:js|mjs|cjs|jsx)$/;

const WORD = /[\p{L}\p{N}]/u;
const LIST_ITEM = /^(?:[-*+•]|\d+[.)])\s+/;
const BLOCK_DECORATION = /^\s*\*/;
const BLOCK_OPENING_STARS = /^\*+/;

function isEslintDirective(comment, directiveComments) {
  if (!directiveComments.has(comment)) return false;
  const directive = comment.value.split(DIRECTIVE_JUSTIFICATION)[0].trim();
  // ESLint reads every word after `global` or `exported` as a name, so it takes a sentence for a directive too
  return !BINDING_DIRECTIVE.test(directive) || BINDING_LIST.test(directive);
}

function isExempt(comment, directiveComments) {
  return isEslintDirective(comment, directiveComments) || EXEMPT_COMMENTS.some((pattern) => pattern.test(comment.value));
}

function isOwnLine(sourceCode, comment) {
  return sourceCode.lines[comment.loc.start.line - 1].slice(0, comment.loc.start.column).trim() === '';
}

function continuesLineCommentRun(sourceCode, previous, comment) {
  return previous?.type === 'Line' && comment.type === 'Line' &&
    comment.loc.start.line === previous.loc.end.line + 1 &&
    isOwnLine(sourceCode, previous) && isOwnLine(sourceCode, comment);
}

function groupLineCommentRuns(sourceCode) {
  const groups = [];
  let previous;

  for (const comment of sourceCode.getAllComments()) {
    if (continuesLineCommentRun(sourceCode, previous, comment)) groups.at(-1).push(comment);
    else groups.push([ comment ]);
    previous = comment;
  }

  return groups;
}

function indentOf(line) {
  return line.column + line.text.search(/\S/);
}

function minIndent(lines) {
  return Math.min(...lines.map(indentOf));
}

function isUnstarredText(line) {
  return WORD.test(line.text) && !BLOCK_DECORATION.test(line.text);
}

// The decoration stars sit left of the text, while a `* ` bullet in an undecorated block sits at its column
function isDecorated(opening, continuation) {
  const starColumn = minIndent(continuation.filter((line) => BLOCK_DECORATION.test(line.text)));
  const textColumn = minIndent([ opening, ...continuation ].filter(isUnstarredText));
  return starColumn < textColumn || !continuation.some(isUnstarredText);
}

function textLinesWithStartColumn(comment) {
  const [ first, ...rest ] = comment.value.split(/\r?\n/);
  const stars = BLOCK_OPENING_STARS.exec(first)?.[0].length ?? 0;
  const opening = { column: comment.loc.start.column + 2 + stars, text: first.slice(stars) };
  const continuation = rest.map((text) => ({ column: 0, text }));

  if (isDecorated(opening, continuation)) {
    return [ opening.text, ...rest.map((line) => line.replace(BLOCK_DECORATION, '')) ].map((text) => ({ column: 0, text }));
  }

  return [ opening, ...continuation ];
}

function countProseLines(lines) {
  const worded = lines
    .filter((line) => WORD.test(line.text))
    .map((line) => ({ indent: indentOf(line), text: line.text.trim() }));
  let maxProseIndent = Math.min(...worded.map((line) => line.indent));
  let count = 0;

  for (const line of worded) {
    const listItem = LIST_ITEM.exec(line.text);
    const isSample = !listItem && line.indent > maxProseIndent;
    if (isSample) continue;

    count++;
    maxProseIndent = listItem ? line.indent + listItem[0].length : line.indent;
  }

  return count;
}

function isForbiddenJsdoc(comment, isJavaScript) {
  if (comment.type !== 'Block' || !comment.value.startsWith('*')) return false;
  // TypeScript reads `@type` as the declared type in a JavaScript file, which has no other syntax for one
  const isTypeAnnotation = comment.loc.start.line === comment.loc.end.line && TYPE_ANNOTATION.test(comment.value);
  return !(isJavaScript && isTypeAnnotation);
}

export const commentLengthAndJsdocRule = {
  meta: {
    type: 'suggestion',
    messages: {
      tooLong: `A comment is capped at ${ MAX_PROSE_LINES } prose lines, and this one has {{ count }}; indented sample lines and bare separator ` +
        `lines do not count. Keep only what ${ COMMENTS_RULE } allows.`,
      jsdoc: `Do not write JSDoc (/** */): write an ordinary comment, and only one ${ COMMENTS_RULE } allows. ` +
        'A single-line /** @type … */ in a JavaScript file is the one exception.',
    },
    schema: [],
  },
  create(context) {
    const { sourceCode } = context;
    const isJavaScript = JAVASCRIPT_FILE.test(context.filename);

    function check(group, directiveComments) {
      const comments = group.filter((comment) => !isExempt(comment, directiveComments));
      const count = countProseLines(comments.flatMap(textLinesWithStartColumn));
      if (count > MAX_PROSE_LINES) {
        context.report({ loc: { start: comments[0].loc.start, end: comments.at(-1).loc.end }, messageId: 'tooLong', data: { count } });
      }

      comments
        .filter((comment) => isForbiddenJsdoc(comment, isJavaScript))
        .forEach((comment) => context.report({ loc: comment.loc, messageId: 'jsdoc' }));
    }

    return {
      Program() {
        const directiveComments = new Set(sourceCode.getInlineConfigNodes());
        groupLineCommentRuns(sourceCode).forEach((group) => check(group, directiveComments));
      },
    };
  },
};
