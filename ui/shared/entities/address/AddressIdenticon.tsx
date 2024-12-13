import { Box, Image } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import config from 'configs/app';
import * as cookies from 'lib/cookies';
import IdenticonGithub from 'ui/shared/IdenticonGithub';

interface IconProps {
  hash: string;
  size: number;
}

const Icon = dynamic(
  async() => {
    const type = cookies.get(cookies.NAMES.ADDRESS_IDENTICON_TYPE) || config.UI.views.address.identiconType;
    switch (type) {
      case 'github': {

        return (props: IconProps) => <IdenticonGithub size={ props.size } seed={ props.hash }/>;
      }

      case 'blockie': {
        const { blo } = (await import('blo'));

        return (props: IconProps) => {
          const data = blo(props.hash as `0x${ string }`, props.size);
          return (
            <Image
              src={ data }
              alt={ `Identicon for ${ props.hash }}` }
            />
          );
        };
      }

      case 'jazzicon': {
        const Jazzicon = await import('react-jazzicon');

        return (props: IconProps) => {
          return (
            <Jazzicon.default
              diameter={ props.size }
              seed={ Jazzicon.jsNumberForAddress(props.hash) }
            />
          );
        };
      }

      case 'gradient_avatar': {
        const GradientAvatar = (await import('gradient-avatar')).default;

        return (props: IconProps) => {
          const svg = GradientAvatar(props.hash, props.size, 'circle');
          return <div dangerouslySetInnerHTML={{ __html: svg }}/>;
        };
      }

      case 'nouns': {
        const Noun = (await import('@cloudnouns/kit'));

        return (props: IconProps) => {
          const noun = Noun.NounFactory.createFromString(props.hash, { size: props.size });
          return <Image src={ noun.svg } alt={ `Identicon for ${ props.hash }}` }/>;
        };
      }

      default: {
        return () => null;
      }
    }
  }, {
    ssr: false,
  });

type Props = IconProps;

const AddressIdenticon = ({ size, hash }: Props) => {
  return (
    <Box boxSize={ `${ size }px` } borderRadius="full" overflow="hidden">
      <Icon size={ size } hash={ hash }/>
    </Box>
  );
};

export default React.memo(AddressIdenticon);
