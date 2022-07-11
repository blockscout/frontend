export const privateTagsAddress = [
  {
    address: '0x4831c121879d3de0e2b181d9d55e9b0724f5d926',
    tag: 'some_tag',
  },
  {
    address: '0x8c461F78760988c4135e363a87dd736f8b671ff0',
    tag: 'some_other_tag',
  },
  {
    address: '0x930F381E649c84579Ef58117E923714964C55D16',
    tag: '12345678901234567890123456789012345',
  },
];

export type TPrivateTagsAddress = Array<TPrivateTagsAddressItem>

export type TPrivateTagsAddressItem = {
  address: string;
  tag: string;
}
