// SPDX-License-Identifier: LicenseRef-Blockscout

import { operationMatchesFilterPhrase, tagNameMatchesFilterPhrase } from '../../utils/swagger-ops-filter';

// Swagger UI passes Immutable.js structures from its internal state.
/* eslint-disable @typescript-eslint/no-explicit-any */
type ImmutableMap = any;

function toOperationRef(op: ImmutableMap) {
  const operation = op.get('operation');

  return {
    path: String(op.get('path', '')),
    method: String(op.get('method', '')),
    id: String(op.get('id', '')),
    operation: operation ? {
      operationId: String(operation.get('operationId', '')),
      summary: String(operation.get('summary', '')),
    } : undefined,
  };
}

export const ExtendedOpsFilterPlugin = () => {
  return {
    fn: {
      opsFilter: (taggedOps: ImmutableMap, phrase: string | boolean) => {
        if (!phrase || phrase === true) {
          return taggedOps;
        }

        const searchPhrase = String(phrase);

        return taggedOps.reduce((result: ImmutableMap, tagData: ImmutableMap, tag: string) => {
          if (tagNameMatchesFilterPhrase(tag, searchPhrase)) {
            return result.set(tag, tagData);
          }

          const operations = tagData.get('operations');
          const filteredOperations = operations.filter((op: ImmutableMap) =>
            operationMatchesFilterPhrase(toOperationRef(op), searchPhrase),
          );

          if (filteredOperations.size > 0) {
            return result.set(tag, tagData.set('operations', filteredOperations));
          }

          return result;
        }, taggedOps.clear());
      },
    },
  };
};
