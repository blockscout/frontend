export const apiKey = [
  {
    token: '6fd12fe0-841c-4abf-ac2a-8c1b08dadf8e',
    name: 'zapper.fi',
  },
  {
    token: '057085a1-d2eb-4d8d-8b89-1dd9fba32071',
    name: 'TenderlyBlaBlaName',
  },
  {
    token: '057085a1-d2eb-4d8d-8b89-1dd9fba32071',
    name: 'Application name',
  },
];

export type TApiKey = Array<TApiKeyItem>

export type TApiKeyItem = {
  token: string;
  name: string;
}
