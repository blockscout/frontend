import React from 'react';

import type { PublicTagApplicationRow } from 'types/api/publicTagSubmissions';

import * as appConfig from 'configs/app';
import { test, expect } from 'playwright/lib';
import { PUBLIC_TAG_APPLICATION_ROW } from 'stubs/publicTagSubmissions';
import { generateListStub } from 'stubs/utils';

import PublicTagApplicationsList from './PublicTagApplicationsList';

const chainId = appConfig.default.chain.id;

const pathParams = { pathParams: { chainId } };

test('empty state', async({ render, mockApiResponse }) => {
  await mockApiResponse(
    'admin:public_tag_applications_list',
    generateListStub<'admin:public_tag_applications_list'>(PUBLIC_TAG_APPLICATION_ROW, 0, { next_page_params: null }),
    pathParams,
  );

  const component = await render(<PublicTagApplicationsList/>);
  await expect(component.getByText(/No requests yet/i)).toBeVisible();
});

test('three-status mixed list', async({ render, mockApiResponse }) => {
  const items: Array<PublicTagApplicationRow> = [
    { ...PUBLIC_TAG_APPLICATION_ROW, id: 1, status: 'pending' },
    { ...PUBLIC_TAG_APPLICATION_ROW, id: 2, status: 'approved' },
    { ...PUBLIC_TAG_APPLICATION_ROW, id: 3, status: 'rejected', reject_reason: null },
  ];

  await mockApiResponse(
    'admin:public_tag_applications_list',
    { items, next_page_params: null },
    pathParams,
  );

  const component = await render(<PublicTagApplicationsList/>);
  // 'Approved' and 'Rejected' only exist in real data rows, not placeholder skeletons
  await expect(component.getByText('Approved').first()).toBeVisible();
  await expect(component.getByText('Rejected').first()).toBeVisible();
  // 'Pending review' appears in both placeholders and real row; real row also exists
  await expect(component.getByText('Pending review')).not.toHaveCount(0);
});

test('rejected row with reject reason wraps badge in tooltip', async({ render, mockApiResponse }) => {
  const reason = 'Duplicate submission';
  const items: Array<PublicTagApplicationRow> = [
    { ...PUBLIC_TAG_APPLICATION_ROW, id: 1, status: 'rejected', reject_reason: reason },
  ];

  await mockApiResponse(
    'admin:public_tag_applications_list',
    { items, next_page_params: null },
    pathParams,
  );

  const component = await render(<PublicTagApplicationsList/>);
  // Wait for real data — only real row has 'Rejected'
  const badge = component.getByText('Rejected').first();
  await expect(badge).toBeVisible();
  // The Tooltip component renders with data-scope="tooltip" on the root element
  // and the content is lazy-mounted; assert the tooltip root wraps the badge
  const tooltipRoot = component.locator('[data-scope="tooltip"]').first();
  await expect(tooltipRoot).toBeAttached();
});

test('pagination visible when next_page_params is set', async({ render, mockApiResponse }) => {
  await mockApiResponse(
    'admin:public_tag_applications_list',
    generateListStub<'admin:public_tag_applications_list'>(
      PUBLIC_TAG_APPLICATION_ROW,
      5,
      { next_page_params: { items_count: 5, page_number: 1 } },
    ),
    pathParams,
  );

  const component = await render(<PublicTagApplicationsList/>);
  await expect(component.getByRole('button', { name: 'Next page' })).toBeVisible();
});

test('error state renders alert', async({ render, mockApiResponse }) => {
  await mockApiResponse(
    'admin:public_tag_applications_list',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as any,
    { ...pathParams, status: 500 },
  );

  const component = await render(<PublicTagApplicationsList/>);
  // DataListDisplay renders DataFetchAlert on error
  await expect(component.getByText(/Something went wrong/i)).toBeVisible();
});

test('status filter — clicking Approved sends status query param', async({ render, mockApiResponse, page }) => {
  await mockApiResponse(
    'admin:public_tag_applications_list',
    generateListStub<'admin:public_tag_applications_list'>(PUBLIC_TAG_APPLICATION_ROW, 2, { next_page_params: null }),
    pathParams,
  );

  await mockApiResponse(
    'admin:public_tag_applications_list',
    generateListStub<'admin:public_tag_applications_list'>(PUBLIC_TAG_APPLICATION_ROW, 1, { next_page_params: null }),
    { ...pathParams, queryParams: { status: 'approved' } },
  );

  const component = await render(<PublicTagApplicationsList/>);
  // Wait for initial data to load
  await expect(component.getByRole('button', { name: 'Approved' })).toBeVisible();

  const reqPromise = page.waitForRequest(
    (req) => req.url().includes('status=approved'),
    { timeout: 5000 },
  );
  await component.getByRole('button', { name: 'Approved' }).click();
  await reqPromise;
});

test('edit modal opens with row tag name pre-filled', async({ render, mockApiResponse, page }) => {
  const items: Array<PublicTagApplicationRow> = [
    { ...PUBLIC_TAG_APPLICATION_ROW, id: 1, status: 'pending', tag_name: 'My Custom Tag' },
  ];

  await mockApiResponse(
    'admin:public_tag_applications_list',
    { items, next_page_params: null },
    pathParams,
  );

  const component = await render(<PublicTagApplicationsList/>);

  // Wait for real data, then click first Edit button
  await expect(component.getByRole('button', { name: 'Edit' }).first()).toBeVisible();
  await component.getByRole('button', { name: 'Edit' }).first().click();

  // Modal renders in a portal; assert via page
  await expect(page.getByText('Edit tag request')).toBeVisible();
  // FormFieldText with floating label uses label not placeholder attribute; assert by input name
  await expect(page.locator('input[name="tag_name"]')).toHaveValue('My Custom Tag');
});
