// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TableColumn } from './types';

import ColumnListRow from './ColumnListRow';

interface Props {
  readonly columns: ReadonlyArray<TableColumn>;
}

const ColumnListStatic = ({ columns }: Props) => {
  return columns.map((column) => <ColumnListRow key={ column.id } column={ column }/>);
};

export default ColumnListStatic;
