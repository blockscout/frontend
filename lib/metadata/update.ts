import type { ApiData } from './types';
import type { RouteParams } from 'nextjs/types';

import type { Route } from 'nextjs-routes';

import generate from './generate';

export default function update<Pathname extends Route['pathname']>(route: RouteParams<Pathname>, apiData: ApiData<Pathname>) {
  const { title, description } = generate(route, apiData);

  window.document.title = title;
  window.document.querySelector('meta[name="description"]')?.setAttribute('content', description);
}
