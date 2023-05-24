import _capitalize from 'lodash/capitalize';

export default function getTabName(tab: string) {
  return tab !== '' ? _capitalize(tab.replaceAll('_', ' ')) : 'Default';
}
