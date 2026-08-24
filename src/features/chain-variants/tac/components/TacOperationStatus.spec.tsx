// @vitest-environment jsdom

import React from 'react';

import * as tac from '@blockscout/tac-operation-lifecycle-types';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';

import { FAILURE_TOOLTIP, getTacOperationStatusText, getTacOperationStatusTooltip, ROLLBACK_TOOLTIP } from '../utils/tac-operation';
import TacOperationStatus from './TacOperationStatus';

const ERROR_REASON = 'Insufficient Fee';

describe('status text', () => {
  it.each([
    [ tac.V2OperationStatus.pending, tac.V2OperationType.TON_TAC_TON, 'TON → TAC → TON' ],
    [ tac.V2OperationStatus.pending, tac.V2OperationType.TAC_TON, 'TAC → TON' ],
    [ tac.V2OperationStatus.pending, tac.V2OperationType.TON_TAC, 'TON → TAC' ],
    [ tac.V2OperationStatus.success, tac.V2OperationType.TON_TAC_TON, 'TON → TAC → TON' ],
    [ tac.V2OperationStatus.failed, tac.V2OperationType.TAC_TON, 'TAC → TON' ],
  ])('is the route for %s / %s', (status, type, expected) => {
    expect(getTacOperationStatusText(status, type)).toBe(expected);
  });

  // `UNKNOWN` means the operation id is indexed but its route is not known yet, so there is no route to show.
  it.each([
    [ tac.V2OperationStatus.pending, 'Pending' ],
    [ tac.V2OperationStatus.success, 'Success' ],
    [ tac.V2OperationStatus.failed, 'Failed' ],
  ])('falls back to the status word for UNKNOWN / %s', (status, expected) => {
    expect(getTacOperationStatusText(status, tac.V2OperationType.UNKNOWN)).toBe(expected);
  });
});

describe('status tooltip', () => {
  it.each([
    [ tac.V2OperationStatus.pending ],
    [ tac.V2OperationStatus.success ],
  ])('is absent for %s', (status) => {
    expect(getTacOperationStatusTooltip(status, undefined, undefined)).toBeNull();
    expect(getTacOperationStatusTooltip(status, ERROR_REASON, undefined)).toBeNull();
  });

  it('names the reason for a failure that carries one', () => {
    expect(getTacOperationStatusTooltip(tac.V2OperationStatus.failed, ERROR_REASON, undefined))
      .toBe(`${ FAILURE_TOOLTIP }. ${ ERROR_REASON }`);
  });

  it.each([
    [ 'undefined', undefined ],
    [ 'null', null ],
  ])('falls back to the plain failure text when the reason is %s', (_, errorReason) => {
    expect(getTacOperationStatusTooltip(tac.V2OperationStatus.failed, errorReason, undefined)).toBe(FAILURE_TOOLTIP);
  });

  it('prefers the rollback text over an error reason', () => {
    expect(getTacOperationStatusTooltip(tac.V2OperationStatus.failed, ERROR_REASON, true)).toBe(ROLLBACK_TOOLTIP);
  });

  it('includes the rollback text when the rollback flag is present', () => {
    expect(getTacOperationStatusTooltip(tac.V2OperationStatus.failed, undefined, true)).toBe(ROLLBACK_TOOLTIP);
  });
});

describe('rendering', () => {
  afterEach(cleanup);

  it('shows the route for a pending operation', () => {
    render(
      <TacOperationStatus status={ tac.V2OperationStatus.pending } type={ tac.V2OperationType.TON_TAC }/>,
    );
    expect(screen.getByText('TON → TAC')).toBeTruthy();
  });

  it('shows the status word and no route when the route is unknown', () => {
    render(
      <TacOperationStatus status={ tac.V2OperationStatus.pending } type={ tac.V2OperationType.UNKNOWN }/>,
    );
    expect(screen.getByText('Pending')).toBeTruthy();
    expect(screen.queryByText(/→/)).toBeNull();
  });

  // `rollback` is carried by a sibling badge and by the tooltip, never by the tag's text.
  it('keeps the route in the status tag for a rollback, and adds no wording of its own', () => {
    render(
      <TacOperationStatus
        status={ tac.V2OperationStatus.failed }
        type={ tac.V2OperationType.TAC_TON }
        errorReason={ ERROR_REASON }
        isRollback
      />,
    );
    expect(screen.getByText('TAC → TON')).toBeTruthy();
    expect(screen.queryByText('Rollback')).toBeNull();
    expect(screen.queryByText(ERROR_REASON)).toBeNull();
  });

  // Core sends `null` where the service's proto omits the field, so the tag must not print it.
  it('renders a null error reason without leaking it into the text', () => {
    render(
      <TacOperationStatus
        status={ tac.V2OperationStatus.failed }
        type={ tac.V2OperationType.TAC_TON }
        errorReason={ null }
      />,
    );
    expect(screen.getByText('TAC → TON')).toBeTruthy();
    expect(screen.queryByText(/null/)).toBeNull();
  });
});
