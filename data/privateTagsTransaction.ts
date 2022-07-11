export const privateTagsTransaction = [
  {
    transaction: '0x44b51ef7746ff48f74f45699d33557faa96059eb8655fdd7bf14a5f529ea3528',
    tag: 'some_tag',
  },
  {
    transaction: '0x44b51ef7746ff48f74f45699d33557faa96059eb8655fdd7bf14a5f529ea9999',
    tag: 'some_other_tag',
  },
];

export type TPrivateTagsTransaction = Array<TPrivateTagsTransactionItem>

export type TPrivateTagsTransactionItem = {
  transaction: string;
  tag: string;
}
