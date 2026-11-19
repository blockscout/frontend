// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import config from 'src/config';

const CONTAINER_ID = 'svg-sprite';

// single source of truth for the sprite URL — also used by _document.tsx to preload it
export const SPRITE_URL = config.app.spriteHash ? `/icons/sprite.${ config.app.spriteHash }.svg` : '/icons/sprite.svg';

// The injected sprite lets SpriteIcon use same-document references (href="#name"), which resolve
// synchronously. An external reference (href="/icons/sprite.svg#name") re-resolves on every remount,
// asynchronously in WebKit even with a warm cache, so icons flicker, e.g. on the lazy tooltip trigger swap.
const SpriteInjector = () => {
  React.useEffect(() => {
    if (document.getElementById(CONTAINER_ID)) {
      return;
    }

    const container = document.createElement('div');
    container.id = CONTAINER_ID;
    container.setAttribute('aria-hidden', 'true');
    // not display:none — that breaks resolution of gradients/defs inside symbols in some browsers
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    container.style.width = '0';
    container.style.height = '0';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    fetch(SPRITE_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load the icon sprite: ${ response.status }`);
        }
        return response.text();
      })
      .then((svg) => {
        container.innerHTML = svg;
      })
      .catch(() => {
        // without the sprite there are no icons to render anyway (same as when the external
        // sprite request failed before); remove the container so a remount can retry
        container.remove();
      });

    // no cleanup — the sprite stays in the document for the app lifetime
  }, []);

  return null;
};

export default SpriteInjector;
