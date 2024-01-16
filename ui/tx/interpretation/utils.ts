// we use that regex as a separator when splitting template and dont want to capture variables
// eslint-disable-next-line regexp/no-useless-non-capturing-group
export const VAR_REGEXP = /\{(?:[^}]+)\}/g;

export const NATIVE_COIN_SYMBOL_VAR_NAME = 'native';

export function extractVariables(templateString: string) {

  const matches = templateString.match(VAR_REGEXP);

  const variablesNames = matches ? matches.map(match => match.slice(1, -1)) : [];

  return variablesNames;
}

export function getStringChunks(template: string) {
  return template.split(VAR_REGEXP);
}
