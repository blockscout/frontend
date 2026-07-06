// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import config from 'src/config';

const CONTAINER_ID = 'svg-sprite';

const HREF = config.app.spriteHash ? `/icons/sprite.${ config.app.spriteHash }.svg` : '/icons/sprite.svg';

// Fetches the SVG sprite once and injects it into the document, so that SpriteIcon can
// reference symbols with a same-document fragment (href="#name").
//
// External references (href="/icons/sprite.svg#name") are re-resolved every time an icon
// element is (re)mounted, and that resolution is asynchronous in WebKit even with a warm
// cache (and in other browsers whenever the sprite is not cached) — so icons flicker
// whenever their subtree remounts, e.g. on the lazy tooltip trigger swap. Same-document
// references resolve synchronously in all browsers.
//
// The sprite URL is content-hashed and served with immutable caching, so this costs one
// request per session — the same request the external references were triggering anyway.
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
    container.style.width = '0';
    container.style.height = '0';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    fetch(HREF)
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
