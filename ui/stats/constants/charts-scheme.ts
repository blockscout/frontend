import type { StatsSection } from 'types/client/stats';

export const statsChartsScheme: Array<StatsSection> = [
  {
    id: 'blocks',
    title: 'Blocks',
    charts: [
      {
        id: 'new-blocks',
        title: 'New blocks',
        description: 'New blocks number per day',
        apiMethodURL: '/node-api/stats/charts/blocks/new',
        visible: true,
      },
    ],
  },
];
