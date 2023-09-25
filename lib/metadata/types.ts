import type { Route } from 'nextjs-routes';

/* eslint-disable @typescript-eslint/indent */
export type ApiData<R extends Route> =
R['pathname'] extends '/token/[hash]' ? { symbol: string } :
R['pathname'] extends '/token/[hash]/instance/[id]' ? { symbol: string } :
R['pathname'] extends '/apps/[id]' ? { app_name: string } :
never;

export interface Metadata {
    title: string;
    description: string;
    opengraph: {
        title: string;
        description?: string;
        imageUrl?: string;
    };
}
