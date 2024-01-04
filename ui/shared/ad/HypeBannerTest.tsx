import { Flex, chakra } from '@chakra-ui/react';
import Script from 'next/script';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';

const HypeBanner = ({ className }: { className?: string }) => {
  const [ loaded, setLoaded ] = React.useState(false);
  const onScriptLoad = React.useCallback(() => {
    setLoaded(true);
  }, []);

  const isMobile = useIsMobile();

  React.useEffect(() => {
    // Initialize client.

    if (loaded) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:
      const client = new window.HypeLab.Client({
        URL: 'https://api.hypelab-staging.com',
        // URL: 'https://api.hypelab.com', /* Production URL */
        propertySlug: 'baaded78c2',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:
        environment: window.HypeLab.Environment.Development,
        // environment: Environment.Production /* Production Environment */
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:
      window.HypeLab.setClient(client);

      // Set up banner placements.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:
      window.HypeLab.banner({ placement: isMobile ? '64412f33ad' : '771e47c10c', container: 'hype-banner' });
    }
  }, [ loaded, isMobile ]);

  return (
    <Flex className={ className } h={{ base: '50px', lg: '90px' }}>
      <Script src="https://cdn.jsdelivr.net/gh/gohypelab/hypelab-vanilla@v0.5.0/index.js" onLoad={ onScriptLoad }/>
      <div id="hype-banner"></div>
    </Flex>
  );
};

export default chakra(HypeBanner);
