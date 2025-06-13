/* eslint-disable */

import type { ThemeTypings } from '@chakra-ui/react';
import { Flex, Grid, chakra, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';

import type { AddressParam } from 'types/api/addressParams';

import type { EntityProps } from 'ui/shared/entities/address/AddressEntity';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityWithTokenFilter from 'ui/shared/entities/address/AddressEntityWithTokenFilter';

import AddressFromToIcon from './AddressFromToIcon';
import { getTxCourseType } from './utils';


const _icon = (
<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
  <path d="M6.00016 8.00004L7.3335 9.33337L10.3335 6.33337M4.88934 2.54584C5.42523 2.50307 5.93397 2.29235 6.34314 1.94365C7.29798 1.12995 8.70235 1.12995 9.65718 1.94365C10.0664 2.29235 10.5751 2.50307 11.111 2.54584C12.3615 2.64563 13.3546 3.63867 13.4544 4.88922C13.4971 5.42511 13.7079 5.93385 14.0566 6.34302C14.8703 7.29786 14.8703 8.70222 14.0566 9.65706C13.7079 10.0662 13.4971 10.575 13.4544 11.1109C13.3546 12.3614 12.3615 13.3544 11.111 13.4542C10.5751 13.497 10.0664 13.7077 9.65718 14.0564C8.70235 14.8701 7.29798 14.8701 6.34314 14.0564C5.93397 13.7077 5.42523 13.497 4.88934 13.4542C3.63879 13.3544 2.64575 12.3614 2.54596 11.1109C2.5032 10.575 2.29247 10.0662 1.94378 9.65706C1.13007 8.70222 1.13007 7.29786 1.94378 6.34302C2.29247 5.93385 2.5032 5.42511 2.54596 4.88922C2.64575 3.63867 3.63879 2.64563 4.88934 2.54584Z" stroke="#6C636B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>

)

const _style = {
  // color: var(--link, #D940A4);
  // font-family: Outfit;
  // font-size: 0.875rem;
  // font-style: normal;
  // font-weight: 400;
  // line-height: normal;
  fontSize: '0.875rem',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: 'normal',
  color: 'var(--link, #D940A4)',
  fontFamily: 'Outfit',
}

type Mode = 'compact' | 'long';



interface Props {
  from: AddressParam;
  to: AddressParam | null;
  current?: string;
  mode?: Mode | Partial<Record<ThemeTypings['breakpoints'], Mode>>;
  className?: string;
  isLoading?: boolean;
  tokenHash?: string;
  truncation?: EntityProps['truncation'];
  noIcon?: boolean;
}

const AddressFromTo = ({ from, to, current, mode: modeProp, className, isLoading, tokenHash = '', noIcon }: Props) => {
  const mode = useBreakpointValue(
    {
      base: (typeof modeProp === 'object' ? modeProp.base : modeProp),
      lg: (typeof modeProp === 'object' ? modeProp.lg : modeProp),
      xl: (typeof modeProp === 'object' ? modeProp.xl : modeProp),
    },
  ) ?? 'long';

  const Entity = tokenHash ? AddressEntityWithTokenFilter : AddressEntity;

    return (
      <Flex className={ className } flexDir="column" rowGap={ 3 }>
        <Flex alignItems="center" columnGap={ 2 }>
          <Entity
            address={ from }
            isLoading={ isLoading }
            noLink={ current === from.hash }
            noCopy={ current === from.hash }
            noIcon={ noIcon }
            tokenHash={ tokenHash }
            truncation="constant"
            maxW="calc(100% - 28px)"
            w="min-content"
            className='lastest-tx-item-address'
          />
        </Flex>
        { to && (
        <Flex 
          alignItems="center"
          flexDirection={ 'row'}
        >
            <Entity
              address={ to }
              isLoading={ isLoading }
              noLink={ current === to.hash }
              noCopy={ current === to.hash }
              noIcon={ noIcon }
              extraIcon = { <span style={{ marginRight: '0.25rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                    <path d="M6.00016 8.00004L7.3335 9.33337L10.3335 6.33337M4.88934 2.54584C5.42523 2.50307 5.93397 2.29235 6.34314 1.94365C7.29798 1.12995 8.70235 1.12995 9.65718 1.94365C10.0664 2.29235 10.5751 2.50307 11.111 2.54584C12.3615 2.64563 13.3546 3.63867 13.4544 4.88922C13.4971 5.42511 13.7079 5.93385 14.0566 6.34302C14.8703 7.29786 14.8703 8.70222 14.0566 9.65706C13.7079 10.0662 13.4971 10.575 13.4544 11.1109C13.3546 12.3614 12.3615 13.3544 11.111 13.4542C10.5751 13.497 10.0664 13.7077 9.65718 14.0564C8.70235 14.8701 7.29798 14.8701 6.34314 14.0564C5.93397 13.7077 5.42523 13.497 4.88934 13.4542C3.63879 13.3544 2.64575 12.3614 2.54596 11.1109C2.5032 10.575 2.29247 10.0662 1.94378 9.65706C1.13007 8.70222 1.13007 7.29786 1.94378 6.34302C2.29247 5.93385 2.5032 5.42511 2.54596 4.88922C2.64575 3.63867 3.63879 2.64563 4.88934 2.54584Z" stroke="#6C636B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
              </span> }
              icon = {{
                name: 'prefix',
              }}
              tokenHash={ tokenHash }
              truncation="constant"
              maxW="calc(100% - 28px)"
              w="min-content"
              ml="0.25rem"
              className='lastest-tx-item-address'
          />
        </Flex>
        ) }
      </Flex>
    );
};

export default chakra(AddressFromTo);
