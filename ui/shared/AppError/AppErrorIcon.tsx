import { Icon } from '@chakra-ui/react';
import React from 'react';

import icon404 from 'icons/error-pages/404.svg';
import icon422 from 'icons/error-pages/422.svg';
import icon429 from 'icons/error-pages/429.svg';
import icon500 from 'icons/error-pages/500.svg';

const ICONS: Record<string, React.FunctionComponent<React.SVGAttributes<SVGElement>> > = {
  '404': icon404,
  '422': icon422,
  '429': icon429,
  '500': icon500,
};

interface Props {
  statusCode: number | undefined;
}

const AppErrorIcon = ({ statusCode }: Props) => {
  return <Icon as={ ICONS[String(statusCode)] || ICONS['500'] } width="200px" height="auto" color="text"/>;
};

export default AppErrorIcon;
