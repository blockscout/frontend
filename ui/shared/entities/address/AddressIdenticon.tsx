import { Box, Image } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import config from 'configs/app';

interface IconProps {
  hash: string;
  size: number;
}

const Icon = dynamic(
  async() => {
    switch (config.UI.views.address.identiconType) {
      case 'github': {
        const IdenticonJs = (await import('identicon.js')).default;

        // eslint-disable-next-line react/display-name
        return (props: IconProps) => {
          const data = new IdenticonJs(props.hash, { size: props.size, format: 'svg' }).toString();
          return (
            <Image
              src={ `data:image/svg+xml;base64,${ data }` }
              alt={ `Identicon for ${ props.hash }}` }
            />
          );
        };
      }

      case 'blockie': {
        const makeBlockie = (await import('ethereum-blockies-base64')).default;

        // eslint-disable-next-line react/display-name
        return (props: IconProps) => {
          const data = makeBlockie(props.hash);
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

        // eslint-disable-next-line react/display-name
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

        // eslint-disable-next-line react/display-name
        return (props: IconProps) => {
          const svg = GradientAvatar(props.hash, props.size);
          return <div dangerouslySetInnerHTML={{ __html: svg }}/>;
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
