// SPDX-License-Identifier: LicenseRef-Blockscout

/* eslint-disable @typescript-eslint/naming-convention */

export const NeverShowInfoPlugin = () => {
  return {
    components: {
      SchemesContainer: () => null,
      ServersContainer: () => null,
      InfoContainer: () => null,
    },
  };
};
