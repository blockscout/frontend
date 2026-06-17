import React from 'react';

import type { AddressCeloAccount as TAddressCeloAccount } from 'src/features/chain-variants/celo/types/api';

import * as addressParamMock from 'src/slices/address/mocks/address-param';

import { Container } from 'src/shared/detailed-info/DetailedInfo';

import { test, expect } from 'playwright/lib';

import AddressCeloAccount from './AddressCeloAccount';

const DATA = {
  name: 'CLabs Validator #2 on alfajores',
  type: 'validator',
  locked_celo: '10000000000000000000000',
  // eslint-disable-next-line max-len
  metadata_url: 'https://storage.googleapis.com/clabs_validator_metadata/alfajores/validator-alfajores-0x050f34537F5b2a00B9B9C752Cb8500a3fcE3DA7d-metadata.json',
  nonvoting_locked_celo: '10000000000000000000000',
  vote_signer_address: addressParamMock.withName,
  validator_signer_address: addressParamMock.withEns,
  attestation_signer_address: addressParamMock.withoutName,
} satisfies TAddressCeloAccount ;

test('default view +@mobile', async({ render }) => {
  const component = await render(
    <Container>
      <AddressCeloAccount data={ DATA }/>
    </Container>,
  );
  await component.getByText('View details').click();
  await expect(component).toHaveScreenshot();
});
