import type { ApiResource } from '../types';
import type * as visualizer from '@blockscout/visualizer-types';

// TODO @tom2drum remove prefix from resource names
export const VISUALIZE_API_RESOURCES = {
  visualize_sol2uml: {
    path: '/api/v1/solidity\\:visualize-contracts',
  },
} satisfies Record<string, ApiResource>;

export type VisualizeApiResourceName = `visualize:${ keyof typeof VISUALIZE_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type VisualizeApiResourcePayload<R extends VisualizeApiResourceName> =
R extends 'visualize:visualize_sol2uml' ? visualizer.VisualizeResponse :
never;
/* eslint-enable @stylistic/indent */
