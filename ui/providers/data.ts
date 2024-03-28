import type { ProvidersPage, TableColumn } from "types/api/boolscan";

import dayjs from "lib/date/dayjs";
import { currencyUnits } from "lib/units";
import { formatAmount } from "lib/utils/helpers";

type Provider = ProvidersPage["items"][0];

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
    id: "providerID",
    label: "PID",
    width: "100px",
    textAlgin: "left",
    render: (data) => {
      return data.providerID;
    },
  },
  {
    id: "providerCreateTimeOnChain",
    label: "Create Time",
    width: "150px",
    textAlgin: "left",
    render: (data) => {
      return dayjs(Number(data.providerCreateTimeOnChain)).format(
        "YYYY-MM-DD HH:mm",
      );
    },
  },
  {
    id: "providerDeviceCount",
    label: "Device",
    width: "100px",
    textAlgin: "center",
    render: (data) => {
      return data.providerDeviceCount;
    },
  },
  {
    id: "deviceStatus",
    label: "Status",
    width: "100px",
    textAlgin: "center",
  },
  {
    id: "providerCap",
    label: `Stake ${ currencyUnits.ether }`,
    width: "130px",
    textAlgin: "right",
    render: (data) => {
      return formatAmount(data.providerTotalCap);
    },
  },
  {
    id: "providerPunishAmount",
    label: `Punish ${ currencyUnits.ether }`,
    width: "130px",
    textAlgin: "right",
    render: (data) => {
      return formatAmount(data.providerPunishAmount);
    },
  },
  {
    id: "providerRewardAmount",
    label: `Reward ${ currencyUnits.ether }`,
    width: "130px",
    textAlgin: "right",
    render: (data) => {
      return formatAmount(data.providerRewardAmount);
    },
  },
];
