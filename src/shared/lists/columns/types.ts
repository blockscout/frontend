// SPDX-License-Identifier: LicenseRef-Blockscout

export interface TableColumn<TColumnId extends string = string> {
  readonly id: TColumnId;
  readonly name: string;
}

export type ColumnState = 'on' | 'off' | 'unavailable';

export type ColumnStates<TColumnId extends string> = Readonly<Record<TColumnId, ColumnState>>;

export type ColumnVisibility<TColumnId extends string> = Partial<Record<TColumnId, boolean>>;

export interface ColumnOverrides<TColumnId extends string> {
  readonly visibility?: ColumnVisibility<TColumnId>;
  readonly order?: ReadonlyArray<TColumnId>;
}
