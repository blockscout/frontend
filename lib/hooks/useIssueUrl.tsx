import React from 'react';

import config from 'configs/app';
import isBrowser from 'lib/isBrowser';

const base = 'https://github.com/blockscout/blockscout/issues/new/';
const labels = 'new UI';
const title = `${ config.chain.name }: <Issue Title>`;

export default function useIssueUrl(backendVersion: string | undefined) {
  const [ userAgent, setUserAgent ] = React.useState('');
  const isInBrowser = isBrowser();

  React.useEffect(() => {
    if (isInBrowser) {
      setUserAgent(window.navigator.userAgent);
    }
  }, [ isInBrowser ]);

  const body = React.useMemo(() => {
    return `
*Describe your issue here.*

### Environment

* Backend Version/branch/commit: ${ backendVersion }
* Frontend Version+commit: ${ [ config.UI.footer.frontendVersion, config.UI.footer.frontendCommit ].filter(Boolean).join('+') }
* User Agent: ${ userAgent }

### Steps to reproduce

*Tell us how to reproduce this issue.  ❤️ if you can push up a branch to your fork with a regression test we can run to reproduce locally.*

### Expected behaviour

*Tell us what should happen.*

### Actual behaviour

*Tell us what happens instead.*
    `;
  }, [ backendVersion, userAgent ]);

  const params = new URLSearchParams({ labels, title, body });
  return base + '?' + params.toString();
}
