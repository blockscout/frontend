import { Button } from '@chakra-ui/react';
import type { ComponentMeta } from '@storybook/react';
import React from 'react';

export default {

  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Button/Examples',
  component: Button,
} as ComponentMeta<typeof Button>;

export const Variants = () => {
  return [ 'solid', 'outline', 'simple', 'ghost', 'subtle' ].map((variant) => <Button key={ variant } variant={ variant }>{ variant }</Button>);
};
