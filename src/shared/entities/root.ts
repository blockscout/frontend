// SPDX-License-Identifier: LicenseRef-Blockscout

import type { IconProps } from '@chakra-ui/react';
import React from 'react';

import type { Props as SpriteIconProps } from 'src/sprite/SpriteIcon';

import type { ImageProps } from 'src/toolkit/chakra/image';
import type { LinkProps } from 'src/toolkit/chakra/link';

import type { EntityChain, EntityLinkResolution } from './resolve-entity-link';

export type TruncationType = 'constant' | 'constant_long' | 'dynamic' | 'tail' | 'none';
export type Truncation =
  TruncationType |
  { readonly type: 'dynamic'; readonly tailLength: number } |
  { readonly type: 'constant'; readonly maxSymbols: number };
export interface TruncationSpec {
  readonly type: TruncationType;
  readonly tailLength?: number;
  readonly maxSymbols?: number;
}

export type Variant = 'content' | 'heading' | 'subheading';

export type IconShieldSource = ImageProps | SpriteIconProps;

export interface EntityIconExtras {
  shield?: IconShieldSource | false;
  hint?: string;
  hintPostfix?: string;
  tooltipInteractive?: boolean;
  size?: number;
  marginRightShield?: string;
}

export type EntityIconOptions = (ImageProps | SpriteIconProps) & Pick<IconProps, 'color' | 'borderRadius' | 'marginRight' | 'boxSize'> & EntityIconExtras;

export interface EntityOptions {
  href?: string;
  icon?: EntityIconOptions;
  link?: LinkProps;
  query?: Record<string, string>;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  chain?: EntityChain;
  isLoading?: boolean;
  variant?: Variant;
  noIcon?: boolean;
  noCopy?: boolean;
  noLink?: boolean;
  noTooltip?: boolean;
  truncation?: Truncation;
}

export interface EntityDefaults extends Pick<
  EntityOptions,
  'truncation' | 'noIcon' | 'noCopy' | 'noLink' | 'noTooltip'
> {
  icon?: Pick<EntityIconOptions, 'borderRadius'>;
}

export interface EntityRootValue<TData = unknown> {
  readonly data: TData | undefined;
  readonly options: EntityOptions;
  readonly link: EntityLinkResolution | undefined;
}

const EntityRootContext = React.createContext<EntityRootValue | null>(null);

export const EntityRootProvider = EntityRootContext.Provider;

export function useEntityRoot<TData>(): EntityRootValue<TData> | null {
  // The provider is typed over `unknown`; the factory that renders it is its only writer, so the data it holds is that factory's `TData`.
  return React.useContext(EntityRootContext) as EntityRootValue<TData> | null;
}

const NO_OPTIONS: EntityOptions = {};

export function useEntityOptions(): EntityOptions {
  return useEntityRoot()?.options ?? NO_OPTIONS;
}
