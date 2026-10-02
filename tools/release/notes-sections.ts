import { orderBy, upperFirst } from 'es-toolkit';

import type { ReleasePullRequest } from './release-prs';

export const ENV_HEADING = 'Environment variables';
export const API_VERSION_HEADING = 'Minimum API version';

const HEADING = /^#{1,6}\s+(\S.*)$/;
const HTML_COMMENT = /<!--[\s\S]*?-->/g;
const TEMPLATE_PLACEHOLDER = /^\*\[[\s\S]*\]\*$/;
const NONE = /^(?:none|n\/a)\b/i;
const EMPHASIS = /[*_`]/g;
const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s/;

function isHeading(line: string, heading?: string): boolean {
  const text = HEADING.exec(line.trim())?.[1];
  return text !== undefined && (heading === undefined || text.toLowerCase() === heading.toLowerCase());
}

function bodySection(body: string, heading: string): string | undefined {
  const lines = body.replace(/\r\n?/g, '\n').split('\n');
  const start = lines.findIndex((line) => isHeading(line, heading));
  if (start === -1) {
    return undefined;
  }
  const end = lines.findIndex((line, index) => index > start && isHeading(line));
  return lines.slice(start + 1, end === -1 ? undefined : end).join('\n');
}

function isEmptySection(section: string): boolean {
  return section === '' || TEMPLATE_PLACEHOLDER.test(section) || NONE.test(section.replace(EMPHASIS, ''));
}

// What the author wrote under the heading; nothing when the section is missing (a PR older than the
// template), starts with "None" (often followed by why), or still holds the template's placeholder.
export function filledSection(body: string, heading: string): string | undefined {
  const section = bodySection(body, heading)?.replace(HTML_COMMENT, '').trim();
  return section === undefined || isEmptySection(section) ? undefined : section;
}

// Nested under the PR's item as written, so code blocks and paragraphs survive; prose opens a sub-item
// so that it does not run on into the PR number.
function nestedChanges(section: string): Array<string> {
  const lines = section.split('\n').map((line) => (line.trim() === '' ? '' : `  ${ line }`));
  return LIST_ITEM.test(section) ? lines : [ `  - ${ lines[0].trim() }`, ...lines.slice(1) ];
}

export function envChanges(prs: ReadonlyArray<ReleasePullRequest>): string {
  return prs
    .flatMap(({ number, body }) => {
      const section = filledSection(body, ENV_HEADING);
      return section === undefined ? [] : [ `- #${ number }`, ...nestedChanges(section) ];
    })
    .join('\n');
}

export interface ApiVersion {
  readonly service: string;
  readonly version: string;
}

const BLOCKSCOUT_API = 'Blockscout API';
const CORE_API = /\b(?:core|blockscout)\b/i;
const SERVICE_WORDS = /\b(?:microservice|service|api)\b/gi;
const VERSION = /\bv?(\d+(?:\.\d+){1,2})/;
const SEPARATOR = /[\n,;]|\band\b/;
const PARENTHETICAL = /\([^()]*\)/g;
const SERVICE_NAME = /^[a-z][\w-]*(?: [\w-]+){0,3}$/i;

function serviceName(written: string): string {
  if (CORE_API.test(written)) {
    return BLOCKSCOUT_API;
  }
  return `${ upperFirst(written.replace(SERVICE_WORDS, '').replace(/\s+/g, ' ').trim()) } microservice API`;
}

// Only a short name right before the version counts as a service, so a version quoted in prose ("the
// latest release is v11.2.6") is not mistaken for a requirement.
function serviceVersion(part: string): ApiVersion | undefined {
  const text = part.replace(LIST_ITEM, '').replace(/\s+/g, ' ');
  const match = VERSION.exec(text);
  const service = text.slice(0, match?.index).trim();
  return match === null || !SERVICE_NAME.test(service) ? undefined : { service: serviceName(service), version: match[1] };
}

export function minimumApiVersions(body: string): Array<ApiVersion> {
  const section = filledSection(body, API_VERSION_HEADING);
  if (section === undefined) {
    return [];
  }
  return section
    .replace(EMPHASIS, '')
    .replace(PARENTHETICAL, '')
    .split(SEPARATOR)
    .map(serviceVersion)
    .filter((apiVersion) => apiVersion !== undefined);
}

// A section the author filled in that names no `<service> v<version>`; the operator reads these PRs by
// hand rather than the notes silently dropping a requirement.
export function unreadableApiVersions(prs: ReadonlyArray<ReleasePullRequest>): Array<number> {
  return prs
    .filter(({ body }) => filledSection(body, API_VERSION_HEADING) !== undefined && minimumApiVersions(body).length === 0)
    .map(({ number }) => number);
}

function compareVersions(a: string, b: string): number {
  const [ aParts, bParts ] = [ a, b ].map((version) => version.split('.').map(Number));
  const index = [ 0, 1, 2 ].find((position) => (aParts[position] ?? 0) !== (bParts[position] ?? 0)) ?? 0;
  return (aParts[index] ?? 0) - (bParts[index] ?? 0);
}

export function compatibilityRows(prs: ReadonlyArray<ReleasePullRequest>): string {
  const highest = new Map<string, string>();
  for (const { service, version } of prs.flatMap(({ body }) => minimumApiVersions(body))) {
    const current = highest.get(service);
    if (current === undefined || compareVersions(version, current) > 0) {
      highest.set(service, version);
    }
  }
  return orderBy([ ...highest ], [ ([ service ]) => service !== BLOCKSCOUT_API, ([ service ]) => service ], [ 'asc', 'asc' ])
    .map(([ service, version ]) => `| ${ service } | v${ version } |`)
    .join('\n');
}

export interface FirstContribution {
  readonly author: string;
  readonly number: number;
}

const FIRST_CONTRIBUTION = /^[*-] @(\S+) made their first contribution in \S*\/pull\/(\d+)/gm;

export function parseFirstContributions(generatedNotes: string): Array<FirstContribution> {
  return [ ...generatedNotes.matchAll(FIRST_CONTRIBUTION) ].map(([ , author, number ]) => ({ author, number: Number(number) }));
}

// GitHub counts a first contribution over the whole compared range, which for a minor includes PRs an
// earlier patch already shipped and announced; only the PRs of these notes are kept.
export function newContributors(prs: ReadonlyArray<ReleasePullRequest>, contributions: ReadonlyArray<FirstContribution>): string {
  const urls = new Map(prs.map(({ number, url }) => [ number, url ]));
  return contributions
    .filter(({ number }) => urls.has(number))
    .map(({ author, number }) => `- @${ author } made their first contribution in ${ urls.get(number) }`)
    .join('\n');
}
