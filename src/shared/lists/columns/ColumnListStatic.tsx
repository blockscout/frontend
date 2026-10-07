// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import ColumnListRow from './ColumnListRow';
import type { ColumnsButtonColumn } from './ColumnsButton';

interface Props {
  readonly columns: ReadonlyArray<ColumnsButtonColumn<string>>;
}

const ColumnListStatic = ({ columns }: Props) => {
  return columns.map((column) => <ColumnListRow key={ column.id } column={ column }/>);
};

export default ColumnListStatic;
