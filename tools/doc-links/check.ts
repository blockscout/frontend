// Reads one file's references and reports the ones that do not resolve. Two forms carry references: a path
// in backticks, and a markdown link with an optional heading anchor.

import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';

import type { RepoIndex } from './resolve';
import { headingSlugs, isPlaceholder, nearby, resolves, shorthandFor } from './resolve';
import { withoutFences, withoutIllustrations } from './strip';

const PATH_EXTENSIONS = /\.(?:md|mdc|mjs|json|jsonc|ya?ml|sh|tsx?)$/;

export interface Finding {
  readonly file: string;
  readonly line: number;
  readonly message: string;
}

interface LineContext {
  readonly repo: RepoIndex;
  readonly realDir: string;
}

// A trailing slash marks a directory, a known extension marks a file. Anything else in backticks — a config
// key, a dotted token, a fragment of prose — is not a path.
const looksLikePath = (target: string): boolean => target.endsWith('/') || PATH_EXTENSIONS.test(target);

function checkBacktickPath(ctx: LineContext, target: string): string | undefined {
  if (/\s/.test(target) || isPlaceholder(target) || !target.includes('/')) return undefined;
  if (!looksLikePath(target)) return undefined;
  if (resolves(ctx.repo, ctx.realDir, target)) return undefined;

  const full = shorthandFor(ctx.repo, target);
  if (full) return `${ target } is shorthand; write it in full: ${ full }`;

  const isReference = target.startsWith('./') ||
    ctx.repo.topLevel.has(target.split('/')[0]) ||
    nearby(ctx.realDir, target);

  return isReference ? `path reference does not exist: ${ target }` : undefined;
}

async function checkLink(ctx: LineContext, target: string): Promise<string | undefined> {
  if (/^(?:https?:|mailto:|#)/.test(target) || isPlaceholder(target)) return undefined;

  const [ filePart, anchor ] = target.split('#');
  // A link with neither a slash nor a file extension is prose in brackets, not a path.
  if (!filePart.includes('/') && !PATH_EXTENSIONS.test(filePart)) return undefined;

  const resolved = resolves(ctx.repo, ctx.realDir, filePart);
  if (!resolved) return `link target does not exist: ${ target }`;
  if (!anchor || !resolved.endsWith('.md')) return undefined;

  const slugs = await headingSlugs(resolved);
  return slugs.has(anchor.toLowerCase()) ? undefined : `heading anchor not found in target: ${ target }`;
}

async function checkLine(ctx: LineContext, rawLine: string): Promise<Array<string>> {
  const checkable = withoutIllustrations(rawLine);

  // Backtick paths are collected first and then stripped, so an inline code span holding a markdown-link
  // example — `[Link Text](URL)` — is not read as a link.
  const spans = [ ...checkable.matchAll(/`([^`]+)`/g) ].map((match) => match[1]);
  const outsideSpans = checkable.replace(/`[^`]+`/g, '');

  const messages: Array<string | undefined> = spans.map((target) => checkBacktickPath(ctx, target));

  for (const [ , target ] of outsideSpans.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    messages.push(await checkLink(ctx, target));
  }

  return messages.filter((message): message is string => message !== undefined);
}

export async function checkFile(repo: RepoIndex, fileRel: string): Promise<Array<Finding>> {
  const absPath = path.join(repo.root, fileRel);
  const ctx: LineContext = { repo, realDir: path.dirname(await realpath(absPath)) };
  const lines = withoutFences(await readFile(absPath, 'utf8'));

  const findings: Array<Finding> = [];
  for (const [ index, rawLine ] of lines.entries()) {
    for (const message of await checkLine(ctx, rawLine)) {
      findings.push({ file: fileRel, line: index + 1, message });
    }
  }

  return findings;
}
