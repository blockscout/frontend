// SPDX-License-Identifier: LicenseRef-Blockscout

export interface SwaggerOperationRef {
  path: string;
  method: string;
  id?: string;
  operation?: {
    operationId?: string;
    summary?: string;
  };
}

export function operationMatchesFilterPhrase(operation: SwaggerOperationRef, phrase: string): boolean {
  const search = phrase.trim().toLowerCase();
  if (!search) {
    return true;
  }

  const fields = [
    operation.path,
    operation.method,
    operation.id,
    operation.operation?.operationId,
    operation.operation?.summary,
  ];

  return fields.some((field) => field?.toLowerCase().includes(search));
}

export function tagNameMatchesFilterPhrase(tag: string, phrase: string): boolean {
  const search = phrase.trim().toLowerCase();
  if (!search) {
    return true;
  }
  return tag.toLowerCase().includes(search);
}
