import type { ApiData } from './types';

import type { Route } from 'nextjs-routes';

import generate from './generate';

export default function update<R extends Route>(route: R, apiData: ApiData<R>) {
  const { title, description, opengraph } = generate(route, apiData);

  window.document.title = title;
  window.document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  window.document.querySelector('meta[property="og:title"]')?.setAttribute('content', opengraph.title);
  opengraph.description &&
    window.document.querySelector('meta[property="og:description"]')?.setAttribute('content', opengraph.description);
}
