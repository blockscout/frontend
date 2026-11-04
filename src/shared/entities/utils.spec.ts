// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getIconProps } from './utils';

describe('getIconProps', () => {
  it('takes the size and margin of the variant preset', () => {
    expect(getIconProps({ name: 'block' })).toEqual({ boxSize: '20px', marginRight: '8px' });
    expect(getIconProps({ name: 'block', variant: 'heading' })).toEqual({ boxSize: '30px', marginRight: '8px' });
  });

  it('widens the margin for a shield', () => {
    expect(getIconProps({ name: 'block' }, true).marginRight).toBe('18px');
    expect(getIconProps({ name: 'block', marginRightShield: '7px' }, true).marginRight).toBe('7px');
  });

  it('lets the caller size and space the icon', () => {
    expect(getIconProps({ name: 'block', boxSize: '24px', marginRight: '5px' })).toEqual({ boxSize: '24px', marginRight: '5px' });
    expect(getIconProps({ name: 'block', mr: '6px' }).marginRight).toBe('6px');
  });
});
