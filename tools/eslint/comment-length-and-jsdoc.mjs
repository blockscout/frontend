const MAX_PROSE_LINES = 8;
const COMMENTS_RULE = '.agents/rules/code-quality.md → "Comments"';

const EXEMPT_COMMENTS = [
  /^[\s*]*(?:eslint-(?:disable|enable|env)\b|eslint\s|globals?\s|exported\s)/,
  /^[\s*]*(?:@ts-|\/\s*<(?:reference|amd-))/,
  /^[\s*]*(?:@vitest-environment\b|Stryker\s+(?:disable|restore)\b)/,
  /SPDX-License-Identifier|@license\b/,
];
const TYPE_ANNOTATION = /^\*\s*@type\b/;
const JAVASCRIPT_FILE = /\.(?:js|mjs|cjs|jsx)$/;

const WORD = /[\p{L}\p{N}]/u;
const LIST_ITEM = /^(?:[-*+•]|\d+[.)])\s+/;
const BLOCK_DECORATION = /^\s*\*/;
const BLOCK_OPENING_STARS = /^\*+/;

function isExempt(comment) {
  return EXEMPT_COMMENTS.some((pattern) => pattern.test(comment.value));
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

function textLinesWithStartColumn(comment) {
  const [ first, ...rest ] = comment.value.split(/\r?\n/);
  const stars = BLOCK_OPENING_STARS.exec(first)?.[0].length ?? 0;
  const opening = first.slice(stars);

  const isDecorated = rest.every((line) => line.trim() === '' || BLOCK_DECORATION.test(line));
  if (isDecorated) {
    return [ opening, ...rest.map((line) => line.replace(BLOCK_DECORATION, '')) ].map((text) => ({ column: 0, text }));
  }

  return [
    { column: comment.loc.start.column + 2 + stars, text: opening },
    ...rest.map((text) => ({ column: 0, text })),
  ];
}

function countProseLines(lines) {
  const worded = lines
    .filter((line) => WORD.test(line.text))
    .map((line) => ({ indent: line.column + line.text.search(/\S/), text: line.text.trim() }));
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

    function check(group) {
      const comments = group.filter((comment) => !isExempt(comment));
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
        groupLineCommentRuns(sourceCode).forEach(check);
      },
    };
  },
};
