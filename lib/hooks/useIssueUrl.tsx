import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';

export default function useIssueUrl(backendVersion: string | undefined) {
  const [ isLoading, setIsLoading ] = React.useState(true);
  const router = useRouter();

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
  // we need to update link whenever page url changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ backendVersion, isLoading, router.asPath ]);

}
