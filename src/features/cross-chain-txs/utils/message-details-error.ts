// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ResourceError } from 'src/api/resources';

const BAD_REQUEST_STATUS = 400;
const INVALID_INPUT_STATUS = 422;

type MessageDetailsErrorState =
  { readonly isError: true; readonly error: ResourceError<unknown> } |
  { readonly isError: false; readonly error: null };

// the indexer answers a malformed message_id with 400; the app's invalid-input page is keyed on 422
export function remapBadRequestToInvalidInput(state: MessageDetailsErrorState): MessageDetailsErrorState {
  if (!state.isError || state.error.status !== BAD_REQUEST_STATUS) {
    return state;
  }

  return { isError: true, error: { ...state.error, status: INVALID_INPUT_STATUS } };
}
