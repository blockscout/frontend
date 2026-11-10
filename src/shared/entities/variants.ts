// SPDX-License-Identifier: LicenseRef-Blockscout

import type { SystemStyleObject } from '@chakra-ui/react';

import type { Variant } from './root';

export interface VariantPreset {
  readonly icon: {
    readonly boxSize: string;
    readonly marginRight: string;
    readonly marginRightShield: string;
  };
  readonly shield: {
    readonly top: string;
    readonly left: string;
  };
  readonly content: SystemStyleObject;
}

const REGULAR_ICON = { boxSize: '20px', marginRight: '8px', marginRightShield: '18px' } as const;
const REGULAR_SHIELD = { top: '6px', left: '12px' } as const;

export const ENTITY_VARIANTS: Record<Variant, VariantPreset> = {
  content: {
    icon: REGULAR_ICON,
    shield: REGULAR_SHIELD,
    content: {},
  },
  subheading: {
    icon: REGULAR_ICON,
    shield: REGULAR_SHIELD,
    content: { textStyle: { base: 'heading.sm', lg: 'heading.md' } },
  },
  heading: {
    icon: { boxSize: '30px', marginRight: '8px', marginRightShield: '14px' },
    shield: { top: '14px', left: '18px' },
    content: {},
  },
};

export const getVariantPreset = (variant: Variant | undefined): VariantPreset => ENTITY_VARIANTS[variant ?? 'content'];
