// SPDX-License-Identifier: LicenseRef-Blockscout

export const toEnvValue = (value: unknown): string => JSON.stringify(value).replaceAll('"', '\'');
