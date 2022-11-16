import { Button } from '@chakra-ui/react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

export default {

  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Button',
  component: Button,
  argTypes: {
    variant: {
      options: [ 'solid', 'outline', 'simple', 'ghost', 'subtle' ],
      control: { type: 'select' },
    },
    colorScheme: {
      options: [ 'blue', 'red', 'gray' ],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button { ...args }/>;

export const Playground = Template.bind({});
Playground.args = {
  variant: 'solid',
  colorScheme: 'blue',
  disabled: false,
  children: 'I am Button',
};
