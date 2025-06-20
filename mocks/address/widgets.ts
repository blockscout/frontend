import type { AddressWidget } from 'types/client/addressWidget';

export const widgets = [
  'widget-1',
  'widget-2',
  'widget-3',
  'widget-4',
  'widget-5',
  'widget-6',
  'widget-7',
] as const;

export const config: Record<string, AddressWidget> = {
  'widget-1': {
    name: 'Widget 1',
    url: 'https://www.example.com',
    pages: [ 'eoa', 'contract', 'token' ],
    icon: 'http://localhost:3000/widget-logo.png',
    title: 'Value',
    value: 'value',
  },
  'widget-2': {
    name: 'Widget 2',
    url: 'https://www.example.com',
    pages: [ 'eoa', 'contract', 'token' ],
    icon: 'http://localhost:3000/widget-logo.png',
    title: 'Another value',
    value: 'value',
  },
  'widget-3': {
    name: 'Widget 3',
    url: 'https://www.example.com',
    pages: [ 'eoa', 'contract', 'token' ],
    icon: 'http://localhost:3000/widget-logo.png',
    title: 'One more value',
    value: 'value',
  },
  'widget-4': {
    name: 'Widget 4',
    url: 'https://www.example.com',
    pages: [ 'eoa', 'contract', 'token' ],
    icon: 'http://localhost:3000/widget-logo.png',
    title: 'Empty value',
    value: 'another_value',
  },
  'widget-5': {
    name: 'Widget 5',
    url: 'https://www.example.com',
    pages: [ 'eoa', 'contract', 'token' ],
    icon: 'http://localhost:3000/widget-logo.png',
    title: 'Pretty big value',
    value: 'value',
  },
  'widget-6': {
    name: 'Widget 6',
    url: 'https://www.example.com',
    pages: [ 'eoa', 'contract', 'token' ],
    icon: 'http://localhost:3000/widget-logo.png',
    title: 'Almost the biggest value',
    value: 'value',
  },
  'widget-7': {
    name: 'Widget 7',
    url: 'https://www.example.com',
    pages: [ 'eoa', 'contract', 'token' ],
    icon: 'http://localhost:3000/widget-logo.png',
    title: 'The biggest value',
    value: 'value',
  },
};
