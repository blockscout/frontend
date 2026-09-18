// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

export default function useIsMounted() {
  const [ isMounted, setIsMounted ] = React.useState(false);

  React.useEffect(() => {
    // react-doctor-disable-next-line react-doctor/no-initialize-state -- hydration guard: server and first client render must both see false
    setIsMounted(true);
  }, [ ]);

  return isMounted;
}
