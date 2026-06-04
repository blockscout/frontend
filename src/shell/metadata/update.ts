// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Route } from 'nextjs-routes';

import type { ApiData } from './types';
import type { RouteParams } from 'src/server/types';

import generate from './generate';

const JSON_LD_SCRIPT_ID = 'blockscout-structured-data';

export default function update<Pathname extends Route['pathname']>(route: RouteParams<Pathname>, apiData: ApiData<Pathname>) {
  const { title, description, jsonLd } = generate(route, apiData);

  window.document.title = title;
  window.document.querySelector('meta[name="description"]')?.setAttribute('content', description);

  if (jsonLd) {
    let scriptElement = window.document.getElementById(JSON_LD_SCRIPT_ID) as HTMLScriptElement | null;

    if (!scriptElement) {
      scriptElement = window.document.createElement('script');
      scriptElement.id = JSON_LD_SCRIPT_ID;
      scriptElement.type = 'application/ld+json';
      window.document.head.appendChild(scriptElement);
    }

    scriptElement.textContent = JSON.stringify(jsonLd);
  } else {
    const existingScript = window.document.getElementById(JSON_LD_SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }
  }
}
