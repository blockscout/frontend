export const publicTags = [
  {
    addresses: [
      {
        address: '0x35317007D203b8a86CA727ad44E473E40450E377',
        addressName: 'DarkForest',
      },
      {
        address: '0x35317007D203b8a86CA727ad44E473E40450E378',
        addressName: 'DarkForest2',
      },
    ],
    tags: [
      {
        name: 'darkforest',
        // colorHex: '#4A5568',
        // backgroundHex: '#E2E8F0',
      },
    ],
    date: 'Jun 10, 2022',
    id: '123',
    userName: 'Tatyana',
    userEmail: 'sample@gmail.com',
    companyName: 'Contract name',
    companyUrl: 'contractname.com',
    comment: 'Please use #ED8936 color for tag...',
  },
  {
    addresses: [
      {
        address: '0x35317007D203b8a86CA727ad44E473E40450E377',
      },
    ],
    tags: [
      {
        name: 'OMNI',
        colorHex: '#FFFFFF',
        backgroundHex: '#1A202C',
      },
      {
        name: '123456789012345678901237123123',
        colorHex: '#FFFFFF',
        backgroundHex: '#6B46C1',
      },
    ],
    date: 'Jun 5, 2022',
    id: '456',
  },
  {
    addresses: [
      {
        address: '0x35317007D203b8a86CA727ad44E473E40450E377',
        addressName: 'Contract name',
      },
    ],
    tags: [
      {
        name: 'SANA',
        colorHex: '#FFFFFF',
        backgroundHex: '#ED8936',
      },
    ],
    date: 'Jun 1, 2022',
    id: '789',
  },
];

export type TPublicTags = Array<TPublicTagItem>

export type TPublicTagItem = {
  addresses: Array<TPublicTagAddress>;
  tags: Array<TPublicTag>;
  // status: typeof STATUS;
  date: string;
  // id is for react element key, as tag or address may not be unique
  id: string;
  userName?: string;
  userEmail?: string;
  companyName?: string;
  companyUrl?: string;
  comment?: string;
}

export type TPublicTagAddress = {
  address: string;
  addressName?: string;
}

export type TPublicTag = {
  name: string;
  colorHex?: string;
  backgroundHex?: string;
}
