import type { Address3rdPartyWidget } from 'client/slices/address/types/view';

export const WIDGET_CONFIG: Address3rdPartyWidget = {
  name: 'name',
  url: 'url',
  icon: 'icon',
  title: 'title',
  hint: 'hint',
  pages: [ 'eoa' ],
  valuePath: 'valuePath',
};
