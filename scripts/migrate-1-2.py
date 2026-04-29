#!/usr/bin/env python3
"""Migration script for task 1-2: Migrate client/shared/"""

import os
import re
import shutil

ROOT = '/home/user/frontend'
os.chdir(ROOT)

FILE_MOVES = [
    # analytics (lib/mixpanel/)
    ('lib/mixpanel/index.ts',           'client/shared/analytics/index.ts'),
    ('lib/mixpanel/getPageType.ts',     'client/shared/analytics/get-page-type.ts'),
    ('lib/mixpanel/getTabName.ts',      'client/shared/analytics/get-tab-name.ts'),
    ('lib/mixpanel/logEvent.ts',        'client/shared/analytics/log-event.ts'),
    ('lib/mixpanel/reset.ts',           'client/shared/analytics/reset.ts'),
    ('lib/mixpanel/useInit.tsx',        'client/shared/analytics/useInit.tsx'),
    ('lib/mixpanel/useLogPageView.tsx', 'client/shared/analytics/useLogPageView.tsx'),
    ('lib/mixpanel/userProfile.ts',     'client/shared/analytics/user-profile.ts'),
    ('lib/mixpanel/utils.ts',           'client/shared/analytics/utils.ts'),
    # monitoring/rollbar (lib/rollbar/)
    ('lib/rollbar/index.tsx',           'client/shared/monitoring/rollbar/index.tsx'),
    ('lib/rollbar/utils.ts',            'client/shared/monitoring/rollbar/utils.ts'),
    # feature-flags (lib/growthbook/)
    ('lib/growthbook/consts.ts',          'client/shared/feature-flags/consts.ts'),
    ('lib/growthbook/init.ts',            'client/shared/feature-flags/init.ts'),
    ('lib/growthbook/useFeatureValue.ts', 'client/shared/feature-flags/useFeatureValue.ts'),
    ('lib/growthbook/useLoadFeatures.ts', 'client/shared/feature-flags/useLoadFeatures.ts'),
    # chain (lib/networks/ + lib/units.ts, with network→chain rename)
    ('lib/networks/getNetworkTitle.ts',              'client/shared/chain/get-chain-title.ts'),
    ('lib/networks/getNetworkUtilizationParams.ts',  'client/shared/chain/get-chain-utilization-params.ts'),
    ('lib/networks/getNetworkValidationActionText.ts','client/shared/chain/get-chain-validation-action-text.ts'),
    ('lib/networks/getNetworkValidatorTitle.ts',     'client/shared/chain/get-chain-validator-title.ts'),
    ('lib/networks/networkExplorers.ts',             'client/shared/chain/chain-explorers.ts'),
    ('lib/units.ts',                                 'client/shared/chain/units.ts'),
    # router (lib/router/ + filter helpers)
    ('lib/router/getQueryParamString.ts',   'client/shared/router/get-query-param-string.ts'),
    ('lib/router/removeQueryParam.ts',      'client/shared/router/remove-query-param.ts'),
    ('lib/router/types.ts',                 'client/shared/router/types.ts'),
    ('lib/router/updateQueryParam.ts',      'client/shared/router/update-query-param.ts'),
    ('lib/router/useEtherscanRedirects.ts', 'client/shared/router/useEtherscanRedirects.ts'),
    ('lib/router/useQueryParams.ts',        'client/shared/router/useQueryParams.ts'),
    ('lib/getFilterValueFromQuery.ts',      'client/shared/router/get-filter-value-from-query.ts'),
    ('lib/getFilterValuesFromQuery.ts',     'client/shared/router/get-filter-values-from-query.ts'),
    ('lib/getValuesArrayFromQuery.ts',      'client/shared/router/get-values-array-from-query.ts'),
    # errors (lib/errors/)
    ('lib/errors/getErrorCause.ts',            'client/shared/errors/get-error-cause.ts'),
    ('lib/errors/getErrorCauseStatusCode.ts',  'client/shared/errors/get-error-cause-status-code.ts'),
    ('lib/errors/getErrorMessage.ts',          'client/shared/errors/get-error-message.ts'),
    ('lib/errors/getErrorObj.ts',              'client/shared/errors/get-error-obj.ts'),
    ('lib/errors/getErrorObjPayload.ts',       'client/shared/errors/get-error-obj-payload.ts'),
    ('lib/errors/getErrorObjStatusCode.ts',    'client/shared/errors/get-error-obj-status-code.ts'),
    ('lib/errors/getErrorProp.ts',             'client/shared/errors/get-error-prop.ts'),
    ('lib/errors/getErrorStack.ts',            'client/shared/errors/get-error-stack.ts'),
    ('lib/errors/getResourceErrorPayload.tsx', 'client/shared/errors/get-resource-error-payload.tsx'),
    ('lib/errors/throwOnAbsentParamError.ts',  'client/shared/errors/throw-on-absent-param-error.ts'),
    ('lib/errors/throwOnResourceLoadError.ts', 'client/shared/errors/throw-on-resource-load-error.ts'),
    # lib/getErrorMessage.ts → account feature util (different file, different purpose)
    ('lib/getErrorMessage.ts', 'client/features/account/utils/get-api-error-text.ts'),
    # web3 (lib/web3/)
    ('lib/web3/chains.ts',                        'client/shared/web3/chains.ts'),
    ('lib/web3/client.ts',                        'client/shared/web3/client.ts'),
    ('lib/web3/detectWallet.ts',                  'client/shared/web3/detect-wallet.ts'),
    ('lib/web3/utils.ts',                         'client/shared/web3/utils.ts'),
    ('lib/web3/wagmiConfig.ts',                   'client/shared/web3/wagmi-config.ts'),
    ('lib/web3/wallets.ts',                       'client/shared/web3/wallets.ts'),
    ('lib/web3/useAccount.ts',                    'client/shared/web3/useAccount.ts'),
    ('lib/web3/useAccountWithDomain.ts',          'client/shared/web3/useAccountWithDomain.ts'),
    ('lib/web3/useAddChain.tsx',                  'client/shared/web3/useAddChain.tsx'),
    ('lib/web3/useAddChainClick.ts',              'client/shared/web3/useAddChainClick.ts'),
    ('lib/web3/useDetectWalletEip6963.ts',        'client/shared/web3/useDetectWalletEip6963.ts'),
    ('lib/web3/useProvider.tsx',                  'client/shared/web3/useProvider.tsx'),
    ('lib/web3/useSwitchChain.tsx',               'client/shared/web3/useSwitchChain.tsx'),
    ('lib/web3/useSwitchOrAddChain.tsx',          'client/shared/web3/useSwitchOrAddChain.tsx'),
    ('lib/web3/useWallet.ts',                     'client/shared/web3/useWallet.ts'),
    ('lib/web3/account/useAccountDynamic.ts',     'client/shared/web3/account/useAccountDynamic.ts'),
    ('lib/web3/account/useAccountFallback.ts',    'client/shared/web3/account/useAccountFallback.ts'),
    ('lib/web3/rpc/formatBlockData.ts',           'client/shared/web3/rpc/format-block-data.ts'),
    ('lib/web3/rpc/formatTxData.ts',              'client/shared/web3/rpc/format-tx-data.ts'),
    ('lib/web3/wallet/types.ts',                  'client/shared/web3/wallet/types.ts'),
    ('lib/web3/wallet/useWalletDynamic.ts',       'client/shared/web3/wallet/useWalletDynamic.ts'),
    ('lib/web3/wallet/useWalletFallback.ts',      'client/shared/web3/wallet/useWalletFallback.ts'),
    ('lib/web3/wallet/useWalletReown.ts',         'client/shared/web3/wallet/useWalletReown.ts'),
    # metadata (lib/metadata/)
    ('lib/metadata/index.ts',                    'client/shared/metadata/index.ts'),
    ('lib/metadata/compileValue.ts',             'client/shared/metadata/compile-value.ts'),
    ('lib/metadata/generate.ts',                 'client/shared/metadata/generate.ts'),
    ('lib/metadata/generate.spec.ts',            'client/shared/metadata/generate.spec.ts'),
    ('lib/metadata/generateProductSchema.ts',    'client/shared/metadata/generate-product-schema.ts'),
    ('lib/metadata/getCanonicalUrl.ts',          'client/shared/metadata/get-canonical-url.ts'),
    ('lib/metadata/getPageOgType.ts',            'client/shared/metadata/get-page-og-type.ts'),
    ('lib/metadata/templates/description.ts',    'client/shared/metadata/templates/description.ts'),
    ('lib/metadata/templates/index.ts',          'client/shared/metadata/templates/index.ts'),
    ('lib/metadata/templates/title.ts',          'client/shared/metadata/templates/title.ts'),
    ('lib/metadata/types.ts',                    'client/shared/metadata/types.ts'),
    ('lib/metadata/update.ts',                   'client/shared/metadata/update.ts'),
    ('lib/metadata/__snapshots__/generate.spec.ts.snap', 'client/shared/metadata/__snapshots__/generate.spec.ts.snap'),
    # date-and-time
    ('lib/hooks/useTimeAgoIncrement.tsx', 'client/shared/date-and-time/useTimeAgoIncrement.tsx'),
    # lists
    ('lib/hooks/useLazyRenderedList.tsx', 'client/shared/lists/useLazyRenderedList.tsx'),
    ('lib/hooks/useInitialList.tsx',      'client/shared/lists/useInitialList.tsx'),
    ('lib/getItemIndex.ts',               'client/shared/lists/get-item-index.ts'),
    # storage
    ('lib/cookies.ts', 'client/shared/storage/cookies.ts'),
    # auth
    ('lib/decodeJWT.ts', 'client/shared/auth/decode-jwt.ts'),
    # i18n
    ('lib/setLocale.ts', 'client/shared/i18n/set-locale.ts'),
    # text
    ('lib/capitalizeFirstLetter.ts', 'client/shared/text/capitalize-first-letter.ts'),
    ('lib/shortenString.ts',         'client/shared/text/shorten-string.ts'),
    ('lib/escapeRegExp.ts',          'client/shared/text/escape-reg-exp.ts'),
    ('lib/highlightText.ts',         'client/shared/text/highlight-text.ts'),
    # transformers
    ('lib/base64ToHex.ts',  'client/shared/transformers/base64-to-hex.ts'),
    ('lib/bytesToBase64.ts','client/shared/transformers/bytes-to-base64.ts'),
    ('lib/bytesToHex.ts',   'client/shared/transformers/bytes-to-hex.ts'),
    ('lib/hexToBase64.ts',  'client/shared/transformers/hex-to-base64.ts'),
    ('lib/hexToBytes.ts',   'client/shared/transformers/hex-to-bytes.ts'),
    ('lib/hexToAddress.ts', 'client/shared/transformers/hex-to-address.ts'),
    ('lib/hexToDecimal.ts', 'client/shared/transformers/hex-to-decimal.ts'),
    ('lib/hexToUtf8.ts',    'client/shared/transformers/hex-to-utf8.ts'),
    # links/utils
    ('lib/utils/stripUtmParams.ts', 'client/shared/links/utils/strip-utm-params.ts'),
    # utils
    ('lib/delay.ts',    'client/shared/utils/delay.ts'),
    ('lib/isMetaKey.tsx','client/shared/utils/is-meta-key.tsx'),
    # hooks
    ('lib/hooks/useDebounce.tsx',                    'client/shared/hooks/useDebounce.tsx'),
    ('lib/hooks/useGradualIncrement.tsx',            'client/shared/hooks/useGradualIncrement.tsx'),
    ('lib/hooks/useIsInitialLoading.tsx',            'client/shared/hooks/useIsInitialLoading.tsx'),
    ('lib/hooks/useIsMobile.tsx',                    'client/shared/hooks/useIsMobile.tsx'),
    ('lib/hooks/useIsMounted.tsx',                   'client/shared/hooks/useIsMounted.tsx'),
    ('lib/hooks/usePreventFocusAfterModalClosing.tsx','client/shared/hooks/usePreventFocusAfterModalClosing.tsx'),
    ('lib/hooks/useTableViewValue.tsx',              'client/shared/hooks/useTableViewValue.tsx'),
    ('lib/hooks/useUpdateValueEffect.tsx',           'client/shared/hooks/useUpdateValueEffect.tsx'),
]

def copy_file(src, dst):
    dst_dir = os.path.dirname(dst)
    os.makedirs(dst_dir, exist_ok=True)
    shutil.copy2(src, dst)

print("=== Phase 1: Copying files ===")
for src, dst in FILE_MOVES:
    if os.path.exists(src):
        copy_file(src, dst)
        print(f"  {src} → {dst}")
    else:
        print(f"  MISSING: {src}")

print("\nDone copying files.")
