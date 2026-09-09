import * as yup from 'yup';
import type { DeFiDropdownButtonText, DeFiDropdownItem } from 'src/features/defi-dropdown/types/client';
import type { IconName } from 'public/icons/name';
import { urlTest } from '../../utils';
import { replaceQuotes } from 'src/config/utils/envs';

const MIN_ITEMS_FOR_DROPDOWN = 2;

const deFiDropdownItemSchema: yup.ObjectSchema<DeFiDropdownItem> = yup
  .object({
    text: yup.string().required(),
    icon: yup.string<IconName>(),
    dappId: yup.string(),
    isEssentialDapp: yup.boolean(),
    url: yup.string().test(urlTest),
  })
  .test('oneOfRequired', 'NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS: Either dappId or url is required', function(value) {
    return Boolean(value.dappId) || Boolean(value.url);
  }) as yup.ObjectSchema<DeFiDropdownItem>;

const deFiDropdownButtonTextSchema = yup
  .object<DeFiDropdownButtonText>()
  .transform(replaceQuotes)
  .json()
  .shape({
    desktop: yup.string().required(),
    mobile: yup.string(),
  });

export const defiDropdownSchema = yup.object({
    NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS: yup
    .array()
    .transform(replaceQuotes)
    .json()
    .of(deFiDropdownItemSchema),
  NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT: yup
    .mixed()
    .test(
      'shape',
      'Invalid schema were provided for NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT, it should have a required desktop and an optional mobile field',
      (data) => data === undefined || deFiDropdownButtonTextSchema.isValidSync(data),
    )
    .test(
      'requires-dropdown',
      `NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT can only be used when NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS contains at least ${ MIN_ITEMS_FOR_DROPDOWN } items`,
      function(data) {
        if (data === undefined) {
          return true;
        }

        const items = this.parent.NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS;

        return Array.isArray(items) && items.length >= MIN_ITEMS_FOR_DROPDOWN;
      },
    ),
});
