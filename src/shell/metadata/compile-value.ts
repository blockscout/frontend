// SPDX-License-Identifier: LicenseRef-Blockscout

export default function compileValue(template: { 'default': string; enhanced?: string }, params: Record<string, string | Array<string> | undefined>) {
  const PLACEHOLDER_REGEX = /%(\w+)%/g;

  const enhancedPlaceholders = (() => {
    const matches = template.enhanced?.match(PLACEHOLDER_REGEX);

    if (matches) {
      return matches.map(match => match.replaceAll('%', ''));
    }

    return null;
  })();

  const templateToUse = (() => {
    const hasCompleteData = enhancedPlaceholders && enhancedPlaceholders.every(placeholder => params[placeholder]);

    if (hasCompleteData && template.enhanced) {
      return template.enhanced;
    }

    return template['default'];
  })();

  return templateToUse
    .replaceAll(PLACEHOLDER_REGEX, (match, p1) => {
      const value = params[p1];

      if (Array.isArray(value)) {
        return value.join(', ');
      }

      if (value === undefined) {
        return '';
      }

      return value;
    })
    .trim();
}
