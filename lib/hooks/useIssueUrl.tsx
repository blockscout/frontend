import React from 'react';

import config from 'configs/app';

export default function useIssueUrl(backendVersion: string | undefined) {
  const [ isLoading, setIsLoading ] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(false);
  }, [ ]);

  return React.useMemo(() => {
    if (isLoading) {
      return '';
    }

    const searchParams = new URLSearchParams({
      template: 'bug_report.yml',
      labels: 'triage',
      link: window.location.href,
      'backend-version': backendVersion || '',
      'frontend-version': [ config.UI.footer.frontendVersion, config.UI.footer.frontendCommit ].filter(Boolean).join('+'),
      'additional-information': `**User Agent:** ${ window.navigator.userAgent }`,
    });
    return `https://github.com/blockscout/blockscout/issues/new/?${ searchParams.toString() }`;
  }, [ backendVersion, isLoading ]);

}
