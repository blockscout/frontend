import { Box } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { MultisenderWidget } from '@multisender.app/multisender-react-widget';

const Styles = () => (
  <Global
    styles={{
      '.multisenderTheme': {
        '--mw-color-brand': 'var(--chakra-colors-blue-600)',
        '--mw-color-brand-stroke': 'var(--chakra-colors-gray-200)',
        '--mw-color-brand-text-secondary': 'var(--chakra-colors-text-secondary)',
        '--mw-color-brand-fill': 'var(--chakra-colors-white)',
        fontFamily: 'var(--chakra-fonts-body)',
        '[class*="_stepBody_"] > span': {
          fontSize: 'var(--chakra-font-sizes-xs)',
          fontWeight: 'var(--chakra-font-weights-normal)',
        },
        '[class*="_step_"]:not([data-progress="true"]), [class*="_step_"][data-completed="true"]': {
          '[class*="_stepBody_"] > span': {
            color: 'var(--chakra-colors-text-secondary)',
          },
          '[class*="_stepIcon_"]': {
            backgroundColor: 'var(--chakra-colors-gray-100)',
          },
          '[class*="_stepCompletedIcon_"]': {
            color: 'var(--chakra-colors-text-secondary)',
          },
        },
        '[class*="_stepIcon_"]': {
          fontSize: 'var(--chakra-font-sizes-xs)',
          width: '24px',
          height: '24px',
          minWidth: '24px',
          minHeight: '24px',
        },
        '[class*="_stepSeparator_"]': {
          height: '1px',
        },
        '[class*="_stepperRoot_"] > :nth-child(1)': {
          padding: '0 12px',
        },
        '[class*="_fieldsetRoot_"]:not([class*="_itemRoot_"])': {
          borderRadius: 'var(--chakra-radii-md)',
          padding: '24px',
          button: {
            fontSize: 'var(--chakra-font-sizes-xs)',
            label: {
              fontWeight: 'var(--chakra-font-weights-medium) !important',
            },
          },
          '& > *:first-child': {
            gap: '12px',
            '& > :nth-child(4) > button': {
              border: '2px solid var(--chakra-colors-link-primary)',
              borderRadius: 'var(--chakra-radii-base)',
              color: 'var(--chakra-colors-link-primary)',
              height: '32px',
              padding: '0 12px',
              fontSize: 'var(--chakra-font-sizes-sm)',
              ':hover': {
                background: 'none',
                color: 'var(--chakra-colors-link-primary-hover)',
                borderColor: 'var(--chakra-colors-link-primary-hover)',
              },
              ':active': {
                transform: 'none',
              },
            },
            '& > :nth-child(5) > button': {
              marginTop: '12px',
              borderRadius: 'var(--chakra-radii-base)',
              color: 'var(--chakra-colors-white)',
              height: '40px',
              backgroundColor: 'var(--chakra-colors-link-primary)',
              ':disabled': {
                opacity: '0.2',
              },
              ':hover': {
                backgroundColor: 'var(--chakra-colors-link-primary-hover)',
              },
            },
          },
          '& > *:last-child': {
            'p[data-size="sm"], a[data-size="sm"]': {
              fontSize: 'var(--chakra-font-sizes-xs)',
            },
            'a[data-size="sm"]': {
              color: 'var(--chakra-colors-blue-600)',
              fontWeight: 'var(--chakra-font-weights-medium) !important',
            },
          },
          'p[data-size="xl"], h5': {
            fontFamily: 'var(--chakra-fonts-heading)',
            fontSize: '18px',
            fontWeight: 'var(--chakra-font-weights-medium) !important',
          },
          '[class*="_tableTr_"]': {
            fontWeight: 'var(--chakra-font-weights-medium)',
            td: {
              padding: '12px 0',
            },
            a: {
              color: 'var(--chakra-colors-link-primary)',
              fontSize: 'var(--chakra-font-sizes-sm)',
              ':hover': {
                color: 'var(--chakra-colors-link-primary-hover)',
                textDecoration: 'none',
              },
            },
          },
          '[class*="SummaryList-module__root__"] + div': {
            gap: '4px',
            '& > div:last-child button': {
              background: 'none',
              border: 'none',
              color: 'var(--chakra-colors-link-primary)',
            },
          },
        },
        '[class*="_itemRoot_"]': {
          border: 'none',
          borderRadius: 'var(--chakra-radii-base)',
          backgroundColor: 'var(--chakra-colors-gray-50)',
          '& > div': {
            gap: '8px',
          },
        },
        '[class*="_input_"]': {
          borderRadius: 'var(--chakra-radii-base)',
          border: '2px solid var(--chakra-colors-gray-100)',
          height: '32px',
          minHeight: '32px',
          fontSize: 'var(--chakra-font-sizes-sm)',
          fontWeight: 'var(--chakra-font-weights-medium)',
          color: 'var(--chakra-colors-input-fg)',
          '&::placeholder': {
            color: 'var(--chakra-colors-input-placeholder)',
          },
        },
        '[class*="RecipientsEditor-module__head_"]': {
          fontSize: 'var(--chakra-font-sizes-xs)',
          marginTop: '12px',
          p: {
            fontWeight: 'var(--chakra-font-weights-medium)',
          },
          button: {
            background: 'none',
            color: 'var(--chakra-colors-link-primary)',
            fontWeight: 'var(--chakra-font-weights-medium)',
            padding: 0,
            height: '18px',
            ':hover': {
              color: 'var(--chakra-colors-link-primary-hover)',
            },
            ':active': {
              transform: 'none',
            },
          },
        },
        '[class*="CodeMirror"]': {
          fontSize: '15px',
          '.cm-scroller': {
            borderRadius: 'var(--chakra-radii-base)',
            borderWidth: '2px',
            borderColor: 'var(--chakra-colors-gray-100)',
          },
          '.cm-gutters': {
            borderTopLeftRadius: '0',
            borderBottomLeftRadius: '0',
            borderRightWidth: '2px',
            borderColor: 'var(--chakra-colors-gray-100)',
            backgroundColor: 'var(--chakra-colors-gray-50)',
            ':before': {
              background: 'none',
            },
          },
          '.cm-placeholder': {
            color: 'var(--chakra-colors-input-placeholder)',
          },
        },
        '[class*="_modalRoot_"]': {
          '[class*="_modalOverlay_"]': {
            backgroundColor: 'var(--chakra-colors-black-alpha-800)',
          },
          '[class*="_closeButton_"]': {
            background: 'none',
            color: 'var(--chakra-colors-close-button-fg)',
            ':hover': {
              color: 'var(--chakra-colors-hover)',
            },
          },
          '[class*="_button_"]': {
            borderRadius: 'var(--chakra-radii-base)',
            color: 'var(--chakra-colors-white)',
            height: '40px',
            backgroundColor: 'var(--chakra-colors-link-primary)',
          },
        },
        'div[role="alert"]': {
          borderRadius: 'var(--chakra-radii-base)',
          padding: '8px 12px',
          fontSize: 'var(--chakra-font-sizes-sm)',
          p: {
            color: 'var(--chakra-colors-black-alpha-800)',
          },
        },
        '[class*="Summary-module__upgradeBtn__"]': {
          borderRadius: 'var(--chakra-radii-base)',
          border: 'none',
          height: '32px',
          padding: '0 12px',
          fontSize: 'var(--chakra-font-sizes-sm) !important',
          fontWeight: 'var(--chakra-font-weights-semibold)',
          '&[class*="_crown_"]': {
            color: 'var(--chakra-colors-white)',
            backgroundColor: 'var(--chakra-colors-link-primary)',
          },
          '&[class*="_gift_"]': {
            color: 'var(--chakra-colors-link-primary)',
            border: '2px solid var(--chakra-colors-link-primary)',
            marginRight: '-4px',
          },
          'span[data-position="left"]': {
            display: 'none',
          },
        },
      },
      '.multisenderMantineProvider': {
        '--mantine-color-text': 'var(--chakra-colors-black-alpha-800)',
        '--mantine-color-dark-4': 'var(--chakra-colors-gray-100)',
        '--mantine-color-red-light': 'var(--chakra-colors-red-100)',
        '--mantine-color-blue-light': 'var(--chakra-colors-black-alpha-50)',
        '& > div': {
          padding: '0 !important',
          gap: 0,
          '& > :nth-child(1)': {
            margin: '0 !important',
          },
        },
      },
    }}/>
);

const config = {
  '1': {
    id: 1,
    name: 'Ethereum',
    blockExplorerUrl: {
      tx: 'https://eth.blockscout.com/tx/',
      address: 'https://eth.blockscout.com/address/',
    },
    multisenderContractAddress: '0x88888c037DF4527933fa8Ab203a89e1e6E58db70',
    rpcUrls: [ 'https://eth.blockscout.com/api/eth-rpc' ],
    blockScoutApiUrl: 'https://eth.blockscout.com',
  },
};

const Multisend = () => {
  return (
    <Box maxW="670px">
      <Styles/>
      <MultisenderWidget
        config={ config }
        logoType="minified"
        classNames={{
          theme: 'multisenderTheme',
          mantineProvider: 'multisenderMantineProvider',
        }}
      />
    </Box>
  );
};

export default Multisend;
