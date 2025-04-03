import { Box } from '@chakra-ui/react';
import React from 'react';

import * as addressMock from 'mocks/address/address';
import * as implementationsMock from 'mocks/address/implementations';
import * as blobsMock from 'mocks/blobs/blobs';
import * as blockMock from 'mocks/blocks/block';
import * as ensMock from 'mocks/ens/domain';
import * as poolMock from 'mocks/pools/pool';
import * as txMock from 'mocks/txs/tx';
import { Link, LinkBox, LinkOverlay } from 'toolkit/chakra/link';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlobEntity from 'ui/shared/entities/blob/BlobEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import PoolEntity from 'ui/shared/entities/pool/PoolEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const TOKEN = {
  address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  circulating_market_cap: '139446916652.6728',
  decimals: '6',
  exchange_rate: '0.999921',
  holders: '8348277',
  icon_url: 'https://assets.coingecko.com/coins/images/325/small/Tether.png?1696501661',
  name: 'Tether',
  symbol: 'USDT',
  total_supply: '76923002799740785',
  type: 'ERC-20' as const,
  volume_24h: '82069586622.4918',
};

const LinkShowcase = () => {

  return (
    <Container value="link">

      <Section>
        <SectionHeader>Variants</SectionHeader>
        <SamplesStack>
          <Sample label="variant: primary">
            <Link href="/blocks" variant="primary">Default</Link>
            <Link href="/" variant="primary" data-hover>Hover</Link>
          </Sample>
          <Sample label="variant: secondary">
            <Link href="/" variant="secondary">Default</Link>
            <Link href="/" variant="secondary" data-hover>Hover</Link>
          </Sample>
          <Sample label="variant: subtle">
            <Link href="/" variant="subtle">Default</Link>
            <Link href="/" variant="subtle" data-hover>Hover</Link>
          </Sample>
          <Sample label="variant: navigation">
            <Link href="/" variant="navigation" p={ 2 } borderRadius="base">Default</Link>
            <Link href="/" variant="navigation" p={ 2 } borderRadius="base" data-hover>Hover</Link>
            <Link href="/" variant="navigation" p={ 2 } borderRadius="base" data-selected>Selected</Link>
            <Link href="/" variant="navigation" p={ 2 } borderRadius="base" data-active>Active</Link>
          </Sample>
          <Sample label="variant: underlaid">
            <Link href="/" variant="underlaid" external>Default</Link>
            <Link href="/" variant="underlaid" external data-hover>Hover</Link>
          </Sample>
          <Sample label="variant: menu">
            <Link href="/" variant="menu">Default</Link>
            <Link href="/" variant="menu" data-hover>Hover</Link>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Loading</SectionHeader>
        <SamplesStack>
          <Sample label="loading: true, variant: primary">
            <Link href="/" loading>hello hello hello</Link>
            <span>Within <Link loading>hello</Link> text</span>
          </Sample>
          <Sample label="loading: true, variant: underlaid">
            <Link href="/" loading variant="underlaid">hello hello hello</Link>
            <span>Within <Link loading variant="underlaid">hello hello</Link> text</span>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Examples</SectionHeader>

        <SectionSubHeader>Address link</SectionSubHeader>
        <SamplesStack>
          <Sample label="Without name" vertical>
            <AddressEntity address={ addressMock.withoutName }/>
            <AddressEntity address={ addressMock.withoutName } isExternal/>
            <AddressEntity address={{ ...addressMock.filecoin, name: null }}/>
            <Box maxW="200px">
              <AddressEntity address={ addressMock.withoutName }/>
            </Box>
            <AddressEntity address={ addressMock.withoutName } isLoading/>
          </Sample>
          <Sample label="Variant: content, subheading" vertical>
            <AddressEntity address={ addressMock.withoutName } variant="content"/>
            <AddressEntity address={ addressMock.withoutName } variant="subheading"/>
          </Sample>
          <Sample label="With name" vertical>
            <AddressEntity address={ addressMock.withName }/>
            <AddressEntity address={ addressMock.withNameTag }/>
            <AddressEntity address={ addressMock.withEns }/>
            <Box maxW="150px">
              <AddressEntity address={ addressMock.withEns }/>
            </Box>
          </Sample>
          <Sample label="Contract" vertical>
            <AddressEntity address={{ ...addressMock.contract, is_verified: false, name: null, implementations: [] }}/>
            <AddressEntity address={{ ...addressMock.contract, implementations: [] }}/>
            <AddressEntity address={{ ...addressMock.contract, implementations: implementationsMock.multiple }}/>
            <AddressEntity address={ addressMock.contract }/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>Token link</SectionSubHeader>
        <SamplesStack>
          <Sample label="With info" vertical w="100%">
            <TokenEntity token={ TOKEN }/>
            <Box maxW="200px">
              <TokenEntity token={{ ...TOKEN, name: 'Very looooooooong name' }} noSymbol/>
            </Box>
            <Box maxW="300px">
              <TokenEntity token={{ ...TOKEN, symbol: 'Very looooooooong symbol' }}/>
            </Box>
            <TokenEntity token={ TOKEN } jointSymbol/>
            <TokenEntity token={ TOKEN } onlySymbol/>
            <TokenEntity token={ TOKEN } isLoading/>
          </Sample>
          <Sample label="With partial info" vertical w="100%">
            <TokenEntity token={{ ...TOKEN, icon_url: null }}/>
            <TokenEntity token={{ ...TOKEN, icon_url: null, name: null, symbol: null }}/>
          </Sample>
          <Sample label="Variant: content, subheading" vertical w="100%">
            <TokenEntity token={ TOKEN } variant="content"/>
            <TokenEntity token={ TOKEN } variant="subheading" jointSymbol/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>Transaction link</SectionSubHeader>
        <SamplesStack>
          <Sample label="Default" vertical w="100%">
            <TxEntity hash={ txMock.base.hash }/>
            <TxEntity hash={ txMock.base.hash } isExternal/>
            <Box maxW="200px">
              <TxEntity hash={ txMock.base.hash } noCopy={ false }/>
            </Box>
            <TxEntity hash={ txMock.base.hash } isLoading noCopy={ false }/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>Block link</SectionSubHeader>
        <SamplesStack>
          <Sample label="Default" vertical w="100%">
            <BlockEntity number={ blockMock.base.height }/>
            <BlockEntity number={ blockMock.base.height } isExternal icon={{ name: 'txn_batches_slim' }}/>
            <Box maxW="150px">
              <BlockEntity number={ 1234567890123456 }/>
            </Box>
            <BlockEntity number={ blockMock.base.height } isLoading/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>NFT link</SectionSubHeader>
        <SamplesStack>
          <Sample label="Default" vertical w="100%">
            <NftEntity id="42" hash={ TOKEN.address }/>
            <Box maxW="250px">
              <NftEntity id="32925298983216553915666621415831103694597106215670571463977478984525997408266" hash={ TOKEN.address }/>
            </Box>
            <NftEntity id="4200000" hash={ TOKEN.address } isLoading/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>ENS link</SectionSubHeader>
        <SamplesStack>
          <Sample label="Default" vertical w="100%">
            <EnsEntity domain={ ensMock.ensDomainA.name } protocol={ ensMock.ensDomainA.protocol }/>
            <Box maxW="150px">
              <EnsEntity domain={ ensMock.ensDomainB.name } protocol={ ensMock.ensDomainB.protocol }/>
            </Box>
            <EnsEntity domain={ ensMock.ensDomainA.name } protocol={ ensMock.ensDomainA.protocol } isLoading/>
          </Sample>
          <Sample label="Variant: content, subheading" vertical w="100%">
            <EnsEntity domain={ ensMock.ensDomainA.name } protocol={ ensMock.ensDomainA.protocol } variant="content"/>
            <EnsEntity domain={ ensMock.ensDomainA.name } protocol={ ensMock.ensDomainA.protocol } variant="subheading"/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>Blob link</SectionSubHeader>
        <SamplesStack>
          <Sample label="Default" vertical w="100%">
            <BlobEntity hash={ blobsMock.base1.hash }/>
            <Box maxW="200px">
              <BlobEntity hash={ blobsMock.base1.hash } isExternal/>
            </Box>
            <BlobEntity hash={ blobsMock.base1.hash } isLoading/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>Pool link</SectionSubHeader>
        <SamplesStack>
          <Sample label="Default" vertical w="100%">
            <PoolEntity pool={{
              ...poolMock.base,
              base_token_icon_url: 'https://coin-images.coingecko.com/coins/images/39926/large/usds.webp?1726666683',
              quote_token_icon_url: 'https://coin-images.coingecko.com/coins/images/39925/large/sky.jpg?1724827980',
            }}/>
            <Box maxW="150px">
              <PoolEntity pool={ poolMock.noIcons } isExternal/>
            </Box>
            <PoolEntity pool={ poolMock.noIcons } isLoading/>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>Link overlay</SectionSubHeader>
        <SamplesStack>
          <Sample label="Internal link">
            <LinkBox p={ 2 } display="flex" flexDirection="column" columnGap={ 2 } borderWidth="1px" borderColor="border.divider" borderRadius="base">
              <LinkOverlay href="/blocks">Main link</LinkOverlay>
              <Link href="/txs">Inner link</Link>
            </LinkBox>
          </Sample>
          <Sample label="External link">
            <LinkBox p={ 2 } display="flex" flexDirection="column" columnGap={ 2 } borderWidth="1px" borderColor="border.divider" borderRadius="base">
              <LinkOverlay href="https://blockscout.com" external>Main link</LinkOverlay>
              <Link href="https://blockscout.com/txs" external>Inner link</Link>
            </LinkBox>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(LinkShowcase);
