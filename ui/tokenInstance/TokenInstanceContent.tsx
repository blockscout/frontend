import { Box, Tag } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/appContext';
import useIsMobile from 'lib/hooks/useIsMobile';
import AdBanner from 'ui/shared/ad/AdBanner';
import TextAd from 'ui/shared/ad/TextAd';
import AddressHeadingInfo from 'ui/shared/AddressHeadingInfo';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';
import TokenLogo from 'ui/shared/TokenLogo';
import TokenInstanceDetails from 'ui/tokenInstance/TokenInstanceDetails';
import TokenInstanceSkeleton from 'ui/tokenInstance/TokenInstanceSkeleton';

export type TokenTabs = 'token_transfers' | 'holders'

const TokenInstanceContent = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const appProps = useAppContext();

  const hash = router.query.hash?.toString();
  const id = router.query.id?.toString();

  const hasGoBackLink = appProps.referrer && appProps.referrer.includes(`/token/${ hash }`) && !appProps.referrer.includes('instance');

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const tokenInstanceQuery = useApiQuery('token_instance', {
    pathParams: { hash, id },
    queryOptions: { enabled: Boolean(hash && id) },
  });

  const tabs: Array<RoutedTab> = [
    { id: 'token_transfers', title: 'Token transfers', component: <span>Token transfers</span> },
    { id: 'holders', title: 'Holders', component: <span>Holders</span> },
    { id: 'metadata', title: 'Metadata', component: <span>Metadata</span> },
  ];

  if (tokenInstanceQuery.isError) {
    throw Error('Token instance fetch failed', { cause: tokenInstanceQuery.error });
  }

  if (tokenInstanceQuery.isLoading) {
    return <TokenInstanceSkeleton/>;
  }

  const tokenLogo = <TokenLogo hash={ tokenInstanceQuery.data.token.address } name={ tokenInstanceQuery.data.token.name } boxSize={ 6 }/>;
  const tokenTag = <Tag>{ tokenInstanceQuery.data.token.type }</Tag>;
  const address = {
    hash: hash || '',
    is_contract: true,
    implementation_name: null,
    watchlist_names: [],
  };

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        text={ `${ tokenInstanceQuery.data.token.name } #${ tokenInstanceQuery.data.id }` }
        backLinkUrl={ hasGoBackLink ? appProps.referrer : undefined }
        backLinkLabel="Back to token page"
        additionalsLeft={ tokenLogo }
        additionalsRight={ tokenTag }
      />

      <AddressHeadingInfo address={ address } token={ tokenInstanceQuery.data.token }/>

      <TokenInstanceDetails data={ tokenInstanceQuery.data } scrollRef={ scrollRef }/>

      <AdBanner mt={{ base: 6, lg: 8 }} justifyContent="center"/>

      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ scrollRef }></Box>

      <RoutedTabs
        tabs={ tabs }
        tabListProps={ isMobile ? { mt: 8 } : { mt: 3, py: 5, marginBottom: 0 } }
      />
    </>
  );
};

export default React.memo(TokenInstanceContent);
