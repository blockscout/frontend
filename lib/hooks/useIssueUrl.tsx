import React from 'react';

import appConfig from 'configs/app/config';
import isBrowser from 'lib/isBrowser';

const base = 'https://github.com/blockscout/blockscout/issues/new/';

const bodyTemplate = `*Describe your issue here.*

### Environment

* Backend Version/branch/commit: ${ appConfig.blockScoutVersion }
* Frontend Version+commit: ${ [ appConfig.frontendVersion, appConfig.frontendCommit ].filter(Boolean).join('+') }
* User Agent: __userAgent__

### Steps to reproduce

*Tell us how to reproduce this issue.  ❤️ if you can push up a branch to your fork with a regression test we can run to reproduce locally.*

### Expected behaviour

*Tell us what should happen.*

### Actual behaviour

*Tell us what happens instead.*`;

const labels = 'new UI';

const title = `${ appConfig.network.name }: <Issue Title>`;

export default function useIssueUrl() {
  const [ userAgent, setUserAgent ] = React.useState('');
  const isInBrowser = isBrowser();

  React.useEffect(() => {
    if (isInBrowser) {
      setUserAgent(window.navigator.userAgent);
    }
  }, [ isInBrowser ]);

  const params = new URLSearchParams({ labels, title, body: bodyTemplate.replace('__userAgent__', userAgent) });
  return base + '?' + params.toString();

}
