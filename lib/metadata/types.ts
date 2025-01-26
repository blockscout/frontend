import type { LineChart } from '@blockscout/stats-types';
import type { TokenInfo } from 'types/api/token';

import type { Route } from 'nextjs-routes';

/* eslint-disable @stylistic/indent */
export type ApiData<Pathname extends Route['pathname']> =
(
    Pathname extends '/address/[hash]' ? { domain_name: string } :
    Pathname extends '/token/[hash]' ? TokenInfo :
    Pathname extends '/token/[hash]/instance/[id]' ? { symbol: string } :
    Pathname extends '/apps/[id]' ? { app_name: string } :
    Pathname extends '/stats/[id]' ? LineChart['info'] :
    never
) | null;

export interface Metadata {
    title: string;
    description: string;
    opengraph: {
        title: string;
        description?: string;
        imageUrl?: string;
    };
    canonical: string | undefined;
}
