import type { NodesPage, TableColumn } from 'types/api/boolscan';

import dayjs from 'lib/date/dayjs';

export function secondToTime(second: number) {
  const times = [];
  let value = second;
  if (value >= 3600) {
    const h = Math.trunc(value / 3600).toString();
    times.push(h.length >= 2 ? h : `0${ h }`);
    value = value - Number(h) * 3600;
  } else {
    times.push('00');
  }

  if (value >= 60) {
    const m = Math.trunc(value / 60).toString();
    times.push(m.length >= 2 ? m : `0${ m }`);
    value = value - Number(m) * 60;
  } else {
    times.push('00');
  }

  times.push(value.toString().length >= 2 ? value : `0${ value }`);

  return times.join(':');
}

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
    label: 'State',
    width: '100px',
    textAlgin: 'center',
    render: (data) => {
      return data.validatorStatus;
    },
  },
  {
    id: 'totalStake',
    label: `Total stake`,
    width: '130px',
    textAlgin: 'right',
    render: () => {
      return '-';
    },
  },
  {
    id: 'ownerStake',
    label: `Owner stake`,
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
