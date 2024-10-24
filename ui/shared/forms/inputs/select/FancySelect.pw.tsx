import _noop from 'lodash/noop';
import React from 'react';

import { test, expect } from 'playwright/lib';

import FancySelect from './FancySelect';

const OPTIONS = [
  { value: 'v0.8.17+commit.8df45f5f', label: 'v0.8.17+commit.8df45f5f' },
  { value: 'v0.8.16+commit.07a7930e', label: 'v0.8.16+commit.07a7930e' },
  { value: 'v0.8.15+commit.e14f2714', label: 'v0.8.15+commit.e14f2714' },
];

test.use({ viewport: { width: 500, height: 300 } });

const defaultProps = {
  options: OPTIONS,
  isRequired: true,
  placeholder: 'Compiler',
  name: 'compiler',
  onChange: _noop,
};

[ 'md' as const, 'lg' as const ].forEach((size) => {
  test.describe(`size ${ size } +@dark-mode`, () => {
    test('empty', async({ render, page }) => {
      const component = await render(
        <FancySelect
          { ...defaultProps }
          size={ size }
          value={ null }
        />,
      );

      await expect(component).toHaveScreenshot();

      await component.getByLabel(/compiler/i).focus();
      await component.getByLabel(/compiler/i).type('1');
      await expect(page).toHaveScreenshot();
    });

    test('filled', async({ render }) => {
      const component = await render(
        <FancySelect
          { ...defaultProps }
          size={ size }
          value={ OPTIONS[0] }
        />,
      );

      await expect(component).toHaveScreenshot();
    });

    test('error', async({ render }) => {
      const component = await render(
        <FancySelect
          { ...defaultProps }
          size={ size }
          value={ null }
          error={{
            type: 'unknown',
            message: 'cannot be empty',
          }}
        />,
      );

      await expect(component).toHaveScreenshot();

      await component.getByLabel(/compiler/i).focus();
      await component.getByLabel(/compiler/i).type('1');
      await expect(component).toHaveScreenshot();
    });

    test('disabled', async({ render }) => {
      const component = await render(
        <FancySelect
          { ...defaultProps }
          size={ size }
          value={ OPTIONS[0] }
          isDisabled
        />,
      );

      await expect(component).toHaveScreenshot();
    });

    test('read-only', async({ render }) => {
      const component = await render(
        <FancySelect
          { ...defaultProps }
          size={ size }
          value={ OPTIONS[0] }
          isReadOnly
        />,
      );

      await expect(component).toHaveScreenshot();
    });
  });
});
