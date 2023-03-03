import _upperFirst from 'lodash/upperFirst';

export function formatName(_name: string) {
  const name = _name
    .replaceAll('_', ' ')
    .replaceAll(/\burl|nft|id\b/gi, (str) => str.toUpperCase());

  return _upperFirst(name.trim());
}
