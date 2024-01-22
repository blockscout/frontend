export const base = {
  sections: [
    {
      id: 'accounts',
      title: 'Accounts',
      charts: [
        {
          id: 'accountsGrowth',
          title: 'Accounts growth',
          description: 'Cumulative accounts number per period',
          units: null,
        },
        {
          id: 'activeAccounts',
          title: 'Active accounts',
          description: 'Active accounts number per period',
          units: null,
        },
        {
          id: 'newAccounts',
          title: 'New accounts',
          description: 'New accounts number per day',
          units: null,
        },
      ],
    },
    {
      id: 'transactions',
      title: 'Transactions',
      charts: [
        {
          id: 'averageTxnFee',
          title: 'Average transaction fee',
          description: 'The average amount in ETH spent per transaction',
          units: 'ETH',
        },
        {
          id: 'newTxns',
          title: 'New transactions',
          description: 'New transactions number',
          units: null,
        },
        {
          id: 'txnsFee',
          title: 'Transactions fees',
          description: 'Amount of tokens paid as fees',
          units: 'ETH',
        },
        {
          id: 'txnsGrowth',
          title: 'Transactions growth',
          description: 'Cumulative transactions number',
          units: null,
        },
        {
          id: 'txnsSuccessRate',
          title: 'Transactions success rate',
          description: 'Successful transactions rate per day',
          units: null,
        },
      ],
    },
    {
      id: 'blocks',
      title: 'Blocks',
      charts: [
        {
          id: 'averageBlockRewards',
          title: 'Average block rewards',
          description: 'Average amount of distributed reward in tokens per day',
          units: 'ETH',
        },
        {
          id: 'averageBlockSize',
          title: 'Average block size',
          description: 'Average size of blocks in bytes',
          units: 'Bytes',
        },
        {
          id: 'newBlocks',
          title: 'New blocks',
          description: 'New blocks number',
          units: null,
        },
      ],
    },
    {
      id: 'tokens',
      title: 'Tokens',
      charts: [
        {
          id: 'newNativeCoinTransfers',
          title: 'New ETH transfers',
          description: 'New token transfers number for the period',
          units: null,
        },
      ],
    },
    {
      id: 'gas',
      title: 'Gas',
      charts: [
        {
          id: 'averageGasLimit',
          title: 'Average gas limit',
          description: 'Average gas limit per block for the period',
          units: null,
        },
        {
          id: 'averageGasPrice',
          title: 'Average gas price',
          description: 'Average gas price for the period (Gwei)',
          units: 'Gwei',
        },
        {
          id: 'gasUsedGrowth',
          title: 'Gas used growth',
          description: 'Cumulative gas used for the period',
          units: null,
        },
      ],
    },
    {
      id: 'contracts',
      title: 'Contracts',
      charts: [
        {
          id: 'newVerifiedContracts',
          title: 'New verified contracts',
          description: 'New verified contracts number for the period',
          units: null,
        },
        {
          id: 'verifiedContractsGrowth',
          title: 'Verified contracts growth',
          description: 'Cumulative number verified contracts for the period',
          units: null,
        },
      ],
    },
  ],
};
