// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { ExternalChain } from 'src/shared/external-chains/types';

import multichainConfig from 'src/features/multichain/chains-config';

import config from 'src/config';
import getChainTooltipText from 'src/shared/external-chains/get-chain-tooltip-text';
import type { Route } from 'src/shared/router/routes';
import { route as buildRoute } from 'src/shared/router/routes';

import { stripTrailingSlash } from 'src/toolkit/utils/url';

export type ExternalRouteTemplateKey = keyof NonNullable<ExternalChain['route_templates']>;

export interface EntityChain extends ExternalChain {
  readonly linkOnly?: boolean;
}

export type EntityChainShield = { readonly src: string } | { readonly name: 'networks/icon-placeholder' };

export interface EntityLinkParams {
  readonly route: Route;
  readonly chain: EntityChain | undefined;
  readonly contextChain: ClusterChainConfig | undefined;
  readonly hintPrefix: string;
  readonly shield?: false;
  readonly routeTemplate?: ExternalRouteTemplateKey;
}

export interface EntityLinkResolution {
  readonly href: string | undefined;
  readonly isExternal: boolean;
  readonly shield: EntityChainShield | undefined;
  readonly hint: string | undefined;
}

type ResolvedTarget =
  { readonly kind: 'context'; readonly chain: ClusterChainConfig | undefined } |
  { readonly kind: 'cluster'; readonly chain: ClusterChainConfig } |
  { readonly kind: 'current'; readonly chain: EntityChain } |
  { readonly kind: 'external'; readonly chain: EntityChain } |
  { readonly kind: 'link-only'; readonly chain: EntityChain };

const resolveTarget = (chain: EntityChain | undefined, contextChain: ClusterChainConfig | undefined): ResolvedTarget => {
  if (!chain) {
    return { kind: 'context', chain: contextChain };
  }

  if (chain.linkOnly) {
    return { kind: 'link-only', chain };
  }

  const clusterChain = multichainConfig()?.chains.find(({ id }) => id === chain.id);
  if (clusterChain) {
    return { kind: 'cluster', chain: clusterChain };
  }

  if (chain.id === config.chain.id) {
    return { kind: 'current', chain };
  }

  return { kind: 'external', chain };
};

const toAbsoluteUrl = (base: string, path: string): string | undefined => {
  try {
    return new URL(base + path).toString();
  } catch (error) {
    return;
  }
};

const resolveExternalHref = (route: Route, chain: ExternalChain, templateKey: ExternalRouteTemplateKey | undefined): string | undefined => {
  if (!chain.explorer_url) {
    return;
  }

  const template = templateKey ? chain.route_templates?.[templateKey] : undefined;
  const hash = route.query?.hash;
  const path = template && typeof hash === 'string' ? template.replace('{hash}', hash) : buildRoute(route);

  return toAbsoluteUrl(stripTrailingSlash(chain.explorer_url), path);
};

const resolveHref = (route: Route, target: ResolvedTarget, templateKey: ExternalRouteTemplateKey | undefined): string | undefined => {
  switch (target.kind) {
    case 'context':
    case 'cluster':
      return buildRoute(route, { chain: target.chain });
    case 'current':
      return buildRoute(route);
    case 'external':
    case 'link-only':
      return resolveExternalHref(route, target.chain, templateKey);
  }
};

const resolveShieldChain = (target: ResolvedTarget, shield: false | undefined): ExternalChain | undefined => {
  if (shield === false || target.kind === 'context' || target.kind === 'link-only') {
    return;
  }

  return target.chain;
};

const toShield = (chain: ExternalChain): EntityChainShield => {
  return chain.logo ? { src: chain.logo } : { name: 'networks/icon-placeholder' };
};

export const resolveEntityLink = (params: EntityLinkParams): EntityLinkResolution => {
  const target = resolveTarget(params.chain, params.contextChain);
  const shieldChain = resolveShieldChain(target, params.shield);

  return {
    href: resolveHref(params.route, target, params.routeTemplate),
    isExternal: target.kind === 'external' || target.kind === 'link-only',
    shield: shieldChain ? toShield(shieldChain) : undefined,
    hint: shieldChain ? getChainTooltipText(shieldChain, params.hintPrefix) : undefined,
  };
};
