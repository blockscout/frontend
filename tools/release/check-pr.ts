import { CATEGORIES, CATEGORY_LABELS, DEPENDENCIES_LABEL, RELEASE_LABEL } from './categories';

export interface TemplateSection {
  readonly heading: string;
  readonly placeholders: ReadonlyArray<string>;
}

const HEADING = /^#{1,6}\s/;
const PLACEHOLDER = /^\*\[.*\]\*$/;

function normalizeNewlines(text: string): string {
  return text.replace(/\r\n?/g, '\n');
}

export function parseTemplate(template: string): Array<TemplateSection> {
  const sections: Array<{ heading: string; placeholders: Array<string> }> = [];
  for (const line of normalizeNewlines(template).split('\n').map((line) => line.trim())) {
    if (HEADING.test(line)) {
      sections.push({ heading: line, placeholders: [] });
    } else if (PLACEHOLDER.test(line)) {
      sections.at(-1)?.placeholders.push(line);
    }
  }
  return sections;
}

function templateFailures(body: string, template: string): Array<string> {
  const normalizedBody = normalizeNewlines(body);
  const bodyLines = new Set(normalizedBody.split('\n').map((line) => line.trim()));

  return parseTemplate(template).flatMap(({ heading, placeholders }) => [
    ...(bodyLines.has(heading) ? [] : [ `Missing template heading "${ heading }"` ]),
    ...(placeholders.some((placeholder) => normalizedBody.includes(placeholder)) ? [ `Placeholder text left under "${ heading }"` ] : []),
  ]);
}

function describeCategory(section: string, labels: ReadonlyArray<string>): string {
  return `${ section } (${ labels.join(', ') })`;
}

function categoryFailures(labels: ReadonlyArray<string>): Array<string> {
  const matched = CATEGORIES
    .map(({ section, labels: sectionLabels }) => ({ section, labels: labels.filter((label) => sectionLabels.includes(label)) }))
    .filter((category) => category.labels.length > 0);

  if (matched.length === 0) {
    return [ `No category label; add one of: ${ [ ...CATEGORY_LABELS ].join(', ') }` ];
  }
  if (matched.length === 1) {
    return [];
  }
  if (labels.includes(DEPENDENCIES_LABEL)) {
    const others = matched.flatMap((category) => category.labels).filter((label) => label !== DEPENDENCIES_LABEL);
    return [ `"${ DEPENDENCIES_LABEL }" is only for PRs that just bump a package and cannot be combined with: ${ others.join(', ') }` ];
  }
  const described = matched.map(({ section, labels: categoryLabels }) => describeCategory(section, categoryLabels));
  return [ `More than one category: ${ described.join('; ') }. Keep labels of one category only` ];
}

export function checkPr(body: string, labels: ReadonlyArray<string>, template: string): Array<string> {
  if (labels.includes(RELEASE_LABEL)) {
    return [];
  }
  return [ ...templateFailures(body, template), ...categoryFailures(labels) ];
}
