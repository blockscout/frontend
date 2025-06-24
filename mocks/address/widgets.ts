import type { Address3rdPartyWidget } from 'types/views/address';

export const widgets = [
  'widget-1',
  'widget-2',
  'widget-3',
  'widget-4',
  'widget-5',
  'widget-6',
  'widget-7',
] as const;

export const values = [ 0, 2534783, 75.34, undefined, 1553.5, 100, 0.99 ];

export const config: Record<string, Address3rdPartyWidget> = {
  'widget-1': {
    name: 'Widget 1',
    url: 'https://www.example.com',
    pages: [ 'eoa', 'contract', 'token' ],
    icon: 'http://localhost:3000/widget-logo.png',
    title: 'Value',
    valuePath: 'value',
  },
  'widget-2': {
    name: 'Widget 2',
    url: 'https://www.example.com',
    pages: [ 'eoa', 'contract', 'token' ],
    icon: 'http://localhost:3000/widget-logo.png',
    title: 'Another value',
    valuePath: 'value',
  },
  'widget-3': {
    name: 'Widget 3',
    url: 'https://www.example.com',
    pages: [ 'eoa', 'contract', 'token' ],
    icon: 'http://localhost:3000/widget-logo.png',
    title: 'One more value',
    valuePath: 'value',
  },
  'widget-4': {
    name: 'Widget 4',
    url: 'https://www.example.com',
    pages: [ 'eoa', 'contract', 'token' ],
    icon: 'http://localhost:3000/widget-logo.png',
    title: 'Empty value',
    valuePath: 'another_value',
  },
  'widget-5': {
    name: 'Widget 5',
    url: 'https://www.example.com',
    pages: [ 'eoa', 'contract', 'token' ],
    icon: 'http://localhost:3000/widget-logo.png',
    title: 'Pretty big value',
    valuePath: 'value',
  },
  'widget-6': {
    name: 'Widget 6',
    url: 'https://www.example.com',
    pages: [ 'eoa', 'contract', 'token' ],
    icon: 'http://localhost:3000/widget-logo.png',
    title: 'Almost the biggest value',
    valuePath: 'value',
  },
  'widget-7': {
    name: 'Widget 7',
    url: 'https://www.example.com',
    pages: [ 'eoa', 'contract', 'token' ],
    icon: 'http://localhost:3000/widget-logo.png',
    title: 'The biggest value',
    valuePath: 'value',
  },
};
