// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { remapBadRequestToInvalidInput } from './message-details-error';

const INVALID_INPUT_STATUS = 422;

const MALFORMED_MESSAGE_ID_ERROR = {
  status: 400,
  statusText: 'Bad Request',
  payload: { code: 3, message: 'invalid message_id' },
};

const WRONG_BRIDGE_ID_ERROR = {
  status: 404,
  statusText: 'Not Found',
  payload: { code: 5, message: 'message not found' },
};

describe('remapBadRequestToInvalidInput', () => {
  it('surfaces a malformed message identifier as invalid input', () => {
    const state = remapBadRequestToInvalidInput({ isError: true, error: MALFORMED_MESSAGE_ID_ERROR });

    expect(state).toEqual({
      isError: true,
      error: { ...MALFORMED_MESSAGE_ID_ERROR, status: INVALID_INPUT_STATUS },
    });
  });

  it('leaves any other status untouched', () => {
    const state = remapBadRequestToInvalidInput({ isError: true, error: WRONG_BRIDGE_ID_ERROR });

    expect(state).toEqual({ isError: true, error: WRONG_BRIDGE_ID_ERROR });
  });

  it('leaves a successful state untouched', () => {
    const state = remapBadRequestToInvalidInput({ isError: false, error: null });

    expect(state).toEqual({ isError: false, error: null });
  });
});
