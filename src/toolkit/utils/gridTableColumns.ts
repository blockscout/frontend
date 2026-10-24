// SPDX-License-Identifier: LicenseRef-Blockscout

export interface GridTableColumn {
  readonly id: string;
  readonly maxWidth?: string;
  readonly isNumeric?: boolean;
}

export const getGridTemplateColumns = (columns: ReadonlyArray<GridTableColumn>): string => {
  return columns
    .map((column) => column.maxWidth ? `fit-content(${ column.maxWidth })` : 'auto')
    .join(' ');
};
