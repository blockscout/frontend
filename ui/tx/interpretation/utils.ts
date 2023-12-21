import type { TxInterpretationSummary } from 'types/api/txInterpretation';

// we use that regex as a separator when splitting template and dont want to capture variables
// eslint-disable-next-line regexp/no-useless-non-capturing-group
export const VAR_REGEXP = /\{(?:[^}]+)\}/g;

export function extractVariables(templateString: string) {

  const matches = templateString.match(VAR_REGEXP);

  const variablesNames = matches ? matches.map(match => match.slice(1, -1)) : [];

  return variablesNames;
}

export function getStringChunks(template: string) {
  return template.split(VAR_REGEXP);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkTemplate(summary: TxInterpretationSummary) {
  const variablesNames = extractVariables(summary.summary_template);

  for (const name of variablesNames) {
    if (!summary.summary_template_variables[name]) {
      return false;
    }
  }

  return true;
}
