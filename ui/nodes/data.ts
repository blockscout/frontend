import type { NodesPage, TableColumn } from 'types/api/boolscan';

import dayjs from 'lib/date/dayjs';
import { currencyUnits } from 'lib/units';

export const statusList = [
  { id: 'All', title: 'All' },
  { id: 'Waiting', title: 'Waiting' },
  { id: 'Active', title: 'Active' },
];

type Provider = NodesPage['items'][0];
export const tableColumns: Array<TableColumn<Provider>> = [
  // {
  //   id: "index",
  //   label: "Rank",
  //   width: "50px",
  //   textAlgin: "left",
  //   render: (_, index = 0) => {
  //     return index + 1;
  //   },
  // },
  {
    id: 'validatorName',
    label: 'Name',
    width: '100px',
    textAlgin: 'left',
    render: (data) => {
      return data.validatorName;
    },
  },
  {
    id: 'validatorRegistrationTime',
    label: 'Create Time',
    width: '150px',
    textAlgin: 'left',
    render: (data) => {
      return dayjs(Number(data.validatorRegistrationTime)).format(
        'YYYY-MM-DD HH:mm',
      );
    },
  },
  {
    id: 'validatorStatus',
    label: 'Status',
    width: '100px',
    textAlgin: 'center',
    render: (data) => {
      return data.validatorStatus;
    },
  },
  {
    id: 'totalStake',
    label: `Total stake ${ currencyUnits.ether }`,
    width: '130px',
    textAlgin: 'right',
    render: () => {
      return '-';
    },
  },
  {
    id: 'ownerStake',
    label: `Owner stake ${ currencyUnits.ether }`,
    width: '130px',
    textAlgin: 'right',
    render: () => {
      return '-';
    },
  },
  {
    id: 'nominators',
    label: `Nominators`,
    width: '130px',
    textAlgin: 'right',
    render: () => {
      return '-';
    },
  },
  {
    id: 'validatorFeeRatio',
    label: `Fee`,
    width: '130px',
    textAlgin: 'right',
    render: (data) => {
      return data.validatorFeeRatio + '%';
    },
  },
];
