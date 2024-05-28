import type { TokenInfo } from 'types/api/token';

import type { Route } from 'nextjs-routes';

/* eslint-disable @typescript-eslint/indent */
export type ApiData<Pathname extends Route['pathname']> =
(
    Pathname extends '/address/[hash]' ? { domain_name: string } :
    Pathname extends '/token/[hash]' ? TokenInfo :
    Pathname extends '/token/[hash]/instance/[id]' ? { symbol: string } :
    Pathname extends '/apps/[id]' ? { app_name: string } :
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
