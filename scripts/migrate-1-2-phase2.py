#!/usr/bin/env python3
"""Phase 2: Update relative imports within moved files + Phase 3: Repo-wide absolute import replacements."""

import os
import re
import subprocess

ROOT = '/home/user/frontend'
os.chdir(ROOT)

def read(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def replace_in_file(path, replacements):
    """Apply list of (old, new) string replacements to a file."""
    content = read(path)
    changed = False
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            changed = True
    if changed:
        write(path, content)
        print(f"  updated: {path}")
    return changed

# ---------------------------------------------------------------------------
# Phase 2: Fix relative imports within moved files
# ---------------------------------------------------------------------------
print("=== Phase 2: Relative imports in moved files ===")

# analytics/index.ts: getPageType→get-page-type, logEvent→log-event, userProfile→user-profile
replace_in_file('client/shared/analytics/index.ts', [
    ("from './getPageType'", "from './get-page-type'"),
    ("from './logEvent'",    "from './log-event'"),
    ("from './userProfile'", "from './user-profile'"),
])

# analytics/useLogPageView.tsx
replace_in_file('client/shared/analytics/useLogPageView.tsx', [
    ("from './getPageType'", "from './get-page-type'"),
    ("from './getTabName'",  "from './get-tab-name'"),
    ("from './logEvent'",    "from './log-event'"),
])

# analytics/useInit.tsx: userProfile → user-profile
replace_in_file('client/shared/analytics/useInit.tsx', [
    ("from './userProfile'", "from './user-profile'"),
])

# errors: relative cross-refs (camelCase → kebab-case)
ERROR_REL = [
    ("from './getErrorObj'",   "from './get-error-obj'"),
    ("from './getErrorCause'", "from './get-error-cause'"),
]
for fname in [
    'client/shared/errors/get-error-message.ts',
    'client/shared/errors/get-error-cause-status-code.ts',
    'client/shared/errors/get-error-obj-status-code.ts',
    'client/shared/errors/get-error-prop.ts',
    'client/shared/errors/get-resource-error-payload.tsx',
    'client/shared/errors/get-error-obj-payload.ts',
]:
    replace_in_file(fname, ERROR_REL)

# web3: detectWallet → detect-wallet (in useProvider.tsx), wagmiConfig stays (no relative ref)
replace_in_file('client/shared/web3/useProvider.tsx', [
    ("from './detectWallet'", "from './detect-wallet'"),
])

# metadata: internal camelCase refs → kebab-case
replace_in_file('client/shared/metadata/generate.ts', [
    ("from './compileValue'",          "from './compile-value'"),
    ("from './generateProductSchema'", "from './generate-product-schema'"),
    ("from './getCanonicalUrl'",       "from './get-canonical-url'"),
    ("from './getPageOgType'",         "from './get-page-og-type'"),
])

# chain files: apply network→chain rename to exported identifiers
CHAIN_RENAMES = [
    ('client/shared/chain/get-chain-title.ts', [
        ('export default function getNetworkTitle', 'export default function getChainTitle'),
    ]),
    ('client/shared/chain/get-chain-utilization-params.ts', [
        ('export default function getNetworkUtilizationParams', 'export default function getChainUtilizationParams'),
    ]),
    ('client/shared/chain/get-chain-validation-action-text.ts', [
        ('export default function getNetworkValidationActionText', 'export default function getChainValidationActionText'),
    ]),
    ('client/shared/chain/get-chain-validator-title.ts', [
        ('export default function getNetworkValidatorTitle', 'export default function getChainValidatorTitle'),
    ]),
    ('client/shared/chain/chain-explorers.ts', [
        ('const networkExplorers:', 'const chainExplorers:'),
        ('export default networkExplorers;', 'export default chainExplorers;'),
    ]),
]
for fpath, reps in CHAIN_RENAMES:
    replace_in_file(fpath, reps)

print("\nPhase 2 done.\n")

# ---------------------------------------------------------------------------
# Phase 3: Repo-wide absolute import replacements
# ---------------------------------------------------------------------------
print("=== Phase 3: Repo-wide absolute import replacements ===")

# Extensions to scan
EXTS = ('.ts', '.tsx', '.js', '.jsx', '.mjs')

# Collect all files in repo (excluding node_modules, .git, .next, scripts)
def collect_files():
    result = []
    skip_dirs = {'.git', 'node_modules', '.next', '.turbo', 'scripts'}
    for dirpath, dirnames, filenames in os.walk(ROOT):
        # Prune dirs
        dirnames[:] = [d for d in dirnames if d not in skip_dirs]
        for fn in filenames:
            if any(fn.endswith(ext) for ext in EXTS):
                result.append(os.path.join(dirpath, fn))
    return result

# Map of old absolute import path → new absolute import path
# Order matters: more specific paths first
IMPORT_MAP = [
    # analytics
    ("'lib/mixpanel/getPageType'", "'client/shared/analytics/get-page-type'"),
    ('"lib/mixpanel/getPageType"', '"client/shared/analytics/get-page-type"'),
    ("'lib/mixpanel/getTabName'",  "'client/shared/analytics/get-tab-name'"),
    ('"lib/mixpanel/getTabName"',  '"client/shared/analytics/get-tab-name"'),
    ("'lib/mixpanel/logEvent'",    "'client/shared/analytics/log-event'"),
    ('"lib/mixpanel/logEvent"',    '"client/shared/analytics/log-event"'),
    ("'lib/mixpanel/reset'",       "'client/shared/analytics/reset'"),
    ('"lib/mixpanel/reset"',       '"client/shared/analytics/reset"'),
    ("'lib/mixpanel/useInit'",     "'client/shared/analytics/useInit'"),
    ('"lib/mixpanel/useInit"',     '"client/shared/analytics/useInit"'),
    ("'lib/mixpanel/useLogPageView'", "'client/shared/analytics/useLogPageView'"),
    ('"lib/mixpanel/useLogPageView"', '"client/shared/analytics/useLogPageView"'),
    ("'lib/mixpanel/userProfile'", "'client/shared/analytics/user-profile'"),
    ('"lib/mixpanel/userProfile"', '"client/shared/analytics/user-profile"'),
    ("'lib/mixpanel/utils'",       "'client/shared/analytics/utils'"),
    ('"lib/mixpanel/utils"',       '"client/shared/analytics/utils"'),
    ("'lib/mixpanel'",             "'client/shared/analytics'"),
    ('"lib/mixpanel"',             '"client/shared/analytics"'),
    # monitoring/rollbar
    ("'lib/rollbar/utils'", "'client/shared/monitoring/rollbar/utils'"),
    ('"lib/rollbar/utils"', '"client/shared/monitoring/rollbar/utils"'),
    ("'lib/rollbar'",       "'client/shared/monitoring/rollbar'"),
    ('"lib/rollbar"',       '"client/shared/monitoring/rollbar"'),
    # feature-flags
    ("'lib/growthbook/consts'",          "'client/shared/feature-flags/consts'"),
    ('"lib/growthbook/consts"',          '"client/shared/feature-flags/consts"'),
    ("'lib/growthbook/init'",            "'client/shared/feature-flags/init'"),
    ('"lib/growthbook/init"',            '"client/shared/feature-flags/init"'),
    ("'lib/growthbook/useFeatureValue'", "'client/shared/feature-flags/useFeatureValue'"),
    ('"lib/growthbook/useFeatureValue"', '"client/shared/feature-flags/useFeatureValue"'),
    ("'lib/growthbook/useLoadFeatures'", "'client/shared/feature-flags/useLoadFeatures'"),
    ('"lib/growthbook/useLoadFeatures"', '"client/shared/feature-flags/useLoadFeatures"'),
    # chain (networks)
    ("'lib/networks/getNetworkTitle'",               "'client/shared/chain/get-chain-title'"),
    ('"lib/networks/getNetworkTitle"',               '"client/shared/chain/get-chain-title"'),
    ("'lib/networks/getNetworkUtilizationParams'",   "'client/shared/chain/get-chain-utilization-params'"),
    ('"lib/networks/getNetworkUtilizationParams"',   '"client/shared/chain/get-chain-utilization-params"'),
    ("'lib/networks/getNetworkValidationActionText'","'client/shared/chain/get-chain-validation-action-text'"),
    ('"lib/networks/getNetworkValidationActionText"','"client/shared/chain/get-chain-validation-action-text"'),
    ("'lib/networks/getNetworkValidatorTitle'",      "'client/shared/chain/get-chain-validator-title'"),
    ('"lib/networks/getNetworkValidatorTitle"',      '"client/shared/chain/get-chain-validator-title"'),
    ("'lib/networks/networkExplorers'",              "'client/shared/chain/chain-explorers'"),
    ('"lib/networks/networkExplorers"',              '"client/shared/chain/chain-explorers"'),
    ("'lib/units'",                                  "'client/shared/chain/units'"),
    ('"lib/units"',                                  '"client/shared/chain/units"'),
    # router
    ("'lib/router/getQueryParamString'",   "'client/shared/router/get-query-param-string'"),
    ('"lib/router/getQueryParamString"',   '"client/shared/router/get-query-param-string"'),
    ("'lib/router/removeQueryParam'",      "'client/shared/router/remove-query-param'"),
    ('"lib/router/removeQueryParam"',      '"client/shared/router/remove-query-param"'),
    ("'lib/router/types'",                 "'client/shared/router/types'"),
    ('"lib/router/types"',                 '"client/shared/router/types"'),
    ("'lib/router/updateQueryParam'",      "'client/shared/router/update-query-param'"),
    ('"lib/router/updateQueryParam"',      '"client/shared/router/update-query-param"'),
    ("'lib/router/useEtherscanRedirects'", "'client/shared/router/useEtherscanRedirects'"),
    ('"lib/router/useEtherscanRedirects"', '"client/shared/router/useEtherscanRedirects"'),
    ("'lib/router/useQueryParams'",        "'client/shared/router/useQueryParams'"),
    ('"lib/router/useQueryParams"',        '"client/shared/router/useQueryParams"'),
    ("'lib/getFilterValueFromQuery'",      "'client/shared/router/get-filter-value-from-query'"),
    ('"lib/getFilterValueFromQuery"',      '"client/shared/router/get-filter-value-from-query"'),
    ("'lib/getFilterValuesFromQuery'",     "'client/shared/router/get-filter-values-from-query'"),
    ('"lib/getFilterValuesFromQuery"',     '"client/shared/router/get-filter-values-from-query"'),
    ("'lib/getValuesArrayFromQuery'",      "'client/shared/router/get-values-array-from-query'"),
    ('"lib/getValuesArrayFromQuery"',      '"client/shared/router/get-values-array-from-query"'),
    # errors
    ("'lib/errors/getErrorCause'",            "'client/shared/errors/get-error-cause'"),
    ('"lib/errors/getErrorCause"',            '"client/shared/errors/get-error-cause"'),
    ("'lib/errors/getErrorCauseStatusCode'",  "'client/shared/errors/get-error-cause-status-code'"),
    ('"lib/errors/getErrorCauseStatusCode"',  '"client/shared/errors/get-error-cause-status-code"'),
    ("'lib/errors/getErrorMessage'",          "'client/shared/errors/get-error-message'"),
    ('"lib/errors/getErrorMessage"',          '"client/shared/errors/get-error-message"'),
    ("'lib/errors/getErrorObj'",              "'client/shared/errors/get-error-obj'"),
    ('"lib/errors/getErrorObj"',              '"client/shared/errors/get-error-obj"'),
    ("'lib/errors/getErrorObjPayload'",       "'client/shared/errors/get-error-obj-payload'"),
    ('"lib/errors/getErrorObjPayload"',       '"client/shared/errors/get-error-obj-payload"'),
    ("'lib/errors/getErrorObjStatusCode'",    "'client/shared/errors/get-error-obj-status-code'"),
    ('"lib/errors/getErrorObjStatusCode"',    '"client/shared/errors/get-error-obj-status-code"'),
    ("'lib/errors/getErrorProp'",             "'client/shared/errors/get-error-prop'"),
    ('"lib/errors/getErrorProp"',             '"client/shared/errors/get-error-prop"'),
    ("'lib/errors/getErrorStack'",            "'client/shared/errors/get-error-stack'"),
    ('"lib/errors/getErrorStack"',            '"client/shared/errors/get-error-stack"'),
    ("'lib/errors/getResourceErrorPayload'",  "'client/shared/errors/get-resource-error-payload'"),
    ('"lib/errors/getResourceErrorPayload"',  '"client/shared/errors/get-resource-error-payload"'),
    ("'lib/errors/throwOnAbsentParamError'",  "'client/shared/errors/throw-on-absent-param-error'"),
    ('"lib/errors/throwOnAbsentParamError"',  '"client/shared/errors/throw-on-absent-param-error"'),
    ("'lib/errors/throwOnResourceLoadError'", "'client/shared/errors/throw-on-resource-load-error'"),
    ('"lib/errors/throwOnResourceLoadError"', '"client/shared/errors/throw-on-resource-load-error"'),
    # lib/getErrorMessage.ts (root) → account utils
    ("'lib/getErrorMessage'", "'client/features/account/utils/get-api-error-text'"),
    ('"lib/getErrorMessage"', '"client/features/account/utils/get-api-error-text"'),
    # web3
    ("'lib/web3/chains'",                       "'client/shared/web3/chains'"),
    ('"lib/web3/chains"',                       '"client/shared/web3/chains"'),
    ("'lib/web3/client'",                       "'client/shared/web3/client'"),
    ('"lib/web3/client"',                       '"client/shared/web3/client"'),
    ("'lib/web3/detectWallet'",                 "'client/shared/web3/detect-wallet'"),
    ('"lib/web3/detectWallet"',                 '"client/shared/web3/detect-wallet"'),
    ("'lib/web3/utils'",                        "'client/shared/web3/utils'"),
    ('"lib/web3/utils"',                        '"client/shared/web3/utils"'),
    ("'lib/web3/wagmiConfig'",                  "'client/shared/web3/wagmi-config'"),
    ('"lib/web3/wagmiConfig"',                  '"client/shared/web3/wagmi-config"'),
    ("'lib/web3/wallets'",                      "'client/shared/web3/wallets'"),
    ('"lib/web3/wallets"',                      '"client/shared/web3/wallets"'),
    ("'lib/web3/useAccount'",                   "'client/shared/web3/useAccount'"),
    ('"lib/web3/useAccount"',                   '"client/shared/web3/useAccount"'),
    ("'lib/web3/useAccountWithDomain'",         "'client/shared/web3/useAccountWithDomain'"),
    ('"lib/web3/useAccountWithDomain"',         '"client/shared/web3/useAccountWithDomain"'),
    ("'lib/web3/useAddChain'",                  "'client/shared/web3/useAddChain'"),
    ('"lib/web3/useAddChain"',                  '"client/shared/web3/useAddChain"'),
    ("'lib/web3/useAddChainClick'",             "'client/shared/web3/useAddChainClick'"),
    ('"lib/web3/useAddChainClick"',             '"client/shared/web3/useAddChainClick"'),
    ("'lib/web3/useDetectWalletEip6963'",       "'client/shared/web3/useDetectWalletEip6963'"),
    ('"lib/web3/useDetectWalletEip6963"',       '"client/shared/web3/useDetectWalletEip6963"'),
    ("'lib/web3/useProvider'",                  "'client/shared/web3/useProvider'"),
    ('"lib/web3/useProvider"',                  '"client/shared/web3/useProvider"'),
    ("'lib/web3/useSwitchChain'",               "'client/shared/web3/useSwitchChain'"),
    ('"lib/web3/useSwitchChain"',               '"client/shared/web3/useSwitchChain"'),
    ("'lib/web3/useSwitchOrAddChain'",          "'client/shared/web3/useSwitchOrAddChain'"),
    ('"lib/web3/useSwitchOrAddChain"',          '"client/shared/web3/useSwitchOrAddChain"'),
    ("'lib/web3/useWallet'",                    "'client/shared/web3/useWallet'"),
    ('"lib/web3/useWallet"',                    '"client/shared/web3/useWallet"'),
    ("'lib/web3/account/useAccountDynamic'",    "'client/shared/web3/account/useAccountDynamic'"),
    ('"lib/web3/account/useAccountDynamic"',    '"client/shared/web3/account/useAccountDynamic"'),
    ("'lib/web3/account/useAccountFallback'",   "'client/shared/web3/account/useAccountFallback'"),
    ('"lib/web3/account/useAccountFallback"',   '"client/shared/web3/account/useAccountFallback"'),
    ("'lib/web3/rpc/formatBlockData'",          "'client/shared/web3/rpc/format-block-data'"),
    ('"lib/web3/rpc/formatBlockData"',          '"client/shared/web3/rpc/format-block-data"'),
    ("'lib/web3/rpc/formatTxData'",             "'client/shared/web3/rpc/format-tx-data'"),
    ('"lib/web3/rpc/formatTxData"',             '"client/shared/web3/rpc/format-tx-data"'),
    ("'lib/web3/wallet/types'",                 "'client/shared/web3/wallet/types'"),
    ('"lib/web3/wallet/types"',                 '"client/shared/web3/wallet/types"'),
    ("'lib/web3/wallet/useWalletDynamic'",      "'client/shared/web3/wallet/useWalletDynamic'"),
    ('"lib/web3/wallet/useWalletDynamic"',      '"client/shared/web3/wallet/useWalletDynamic"'),
    ("'lib/web3/wallet/useWalletFallback'",     "'client/shared/web3/wallet/useWalletFallback'"),
    ('"lib/web3/wallet/useWalletFallback"',     '"client/shared/web3/wallet/useWalletFallback"'),
    ("'lib/web3/wallet/useWalletReown'",        "'client/shared/web3/wallet/useWalletReown'"),
    ('"lib/web3/wallet/useWalletReown"',        '"client/shared/web3/wallet/useWalletReown"'),
    # metadata
    ("'lib/metadata'",                   "'client/shared/metadata'"),
    ('"lib/metadata"',                   '"client/shared/metadata"'),
    # date-and-time
    ("'lib/hooks/useTimeAgoIncrement'",  "'client/shared/date-and-time/useTimeAgoIncrement'"),
    ('"lib/hooks/useTimeAgoIncrement"',  '"client/shared/date-and-time/useTimeAgoIncrement"'),
    # lists
    ("'lib/hooks/useLazyRenderedList'",  "'client/shared/lists/useLazyRenderedList'"),
    ('"lib/hooks/useLazyRenderedList"',  '"client/shared/lists/useLazyRenderedList"'),
    ("'lib/hooks/useInitialList'",       "'client/shared/lists/useInitialList'"),
    ('"lib/hooks/useInitialList"',       '"client/shared/lists/useInitialList"'),
    ("'lib/getItemIndex'",               "'client/shared/lists/get-item-index'"),
    ('"lib/getItemIndex"',               '"client/shared/lists/get-item-index"'),
    # storage
    ("'lib/cookies'",  "'client/shared/storage/cookies'"),
    ('"lib/cookies"',  '"client/shared/storage/cookies"'),
    # auth
    ("'lib/decodeJWT'", "'client/shared/auth/decode-jwt'"),
    ('"lib/decodeJWT"', '"client/shared/auth/decode-jwt"'),
    # i18n
    ("'lib/setLocale'", "'client/shared/i18n/set-locale'"),
    ('"lib/setLocale"', '"client/shared/i18n/set-locale"'),
    # text
    ("'lib/capitalizeFirstLetter'", "'client/shared/text/capitalize-first-letter'"),
    ('"lib/capitalizeFirstLetter"', '"client/shared/text/capitalize-first-letter"'),
    ("'lib/shortenString'",         "'client/shared/text/shorten-string'"),
    ('"lib/shortenString"',         '"client/shared/text/shorten-string"'),
    ("'lib/escapeRegExp'",          "'client/shared/text/escape-reg-exp'"),
    ('"lib/escapeRegExp"',          '"client/shared/text/escape-reg-exp"'),
    ("'lib/highlightText'",         "'client/shared/text/highlight-text'"),
    ('"lib/highlightText"',         '"client/shared/text/highlight-text"'),
    # transformers
    ("'lib/base64ToHex'",  "'client/shared/transformers/base64-to-hex'"),
    ('"lib/base64ToHex"',  '"client/shared/transformers/base64-to-hex"'),
    ("'lib/bytesToBase64'","'client/shared/transformers/bytes-to-base64'"),
    ('"lib/bytesToBase64"','"client/shared/transformers/bytes-to-base64"'),
    ("'lib/bytesToHex'",   "'client/shared/transformers/bytes-to-hex'"),
    ('"lib/bytesToHex"',   '"client/shared/transformers/bytes-to-hex"'),
    ("'lib/hexToBase64'",  "'client/shared/transformers/hex-to-base64'"),
    ('"lib/hexToBase64"',  '"client/shared/transformers/hex-to-base64"'),
    ("'lib/hexToBytes'",   "'client/shared/transformers/hex-to-bytes'"),
    ('"lib/hexToBytes"',   '"client/shared/transformers/hex-to-bytes"'),
    ("'lib/hexToAddress'", "'client/shared/transformers/hex-to-address'"),
    ('"lib/hexToAddress"', '"client/shared/transformers/hex-to-address"'),
    ("'lib/hexToDecimal'", "'client/shared/transformers/hex-to-decimal'"),
    ('"lib/hexToDecimal"', '"client/shared/transformers/hex-to-decimal"'),
    ("'lib/hexToUtf8'",    "'client/shared/transformers/hex-to-utf8'"),
    ('"lib/hexToUtf8"',    '"client/shared/transformers/hex-to-utf8"'),
    # links/utils
    ("'lib/utils/stripUtmParams'", "'client/shared/links/utils/strip-utm-params'"),
    ('"lib/utils/stripUtmParams"', '"client/shared/links/utils/strip-utm-params"'),
    # utils
    ("'lib/delay'",    "'client/shared/utils/delay'"),
    ('"lib/delay"',    '"client/shared/utils/delay"'),
    ("'lib/isMetaKey'","'client/shared/utils/is-meta-key'"),
    ('"lib/isMetaKey"','"client/shared/utils/is-meta-key"'),
    # hooks
    ("'lib/hooks/useDebounce'",                    "'client/shared/hooks/useDebounce'"),
    ('"lib/hooks/useDebounce"',                    '"client/shared/hooks/useDebounce"'),
    ("'lib/hooks/useGradualIncrement'",            "'client/shared/hooks/useGradualIncrement'"),
    ('"lib/hooks/useGradualIncrement"',            '"client/shared/hooks/useGradualIncrement"'),
    ("'lib/hooks/useIsInitialLoading'",            "'client/shared/hooks/useIsInitialLoading'"),
    ('"lib/hooks/useIsInitialLoading"',            '"client/shared/hooks/useIsInitialLoading"'),
    ("'lib/hooks/useIsMobile'",                    "'client/shared/hooks/useIsMobile'"),
    ('"lib/hooks/useIsMobile"',                    '"client/shared/hooks/useIsMobile"'),
    ("'lib/hooks/useIsMounted'",                   "'client/shared/hooks/useIsMounted'"),
    ('"lib/hooks/useIsMounted"',                   '"client/shared/hooks/useIsMounted"'),
    ("'lib/hooks/usePreventFocusAfterModalClosing'","'client/shared/hooks/usePreventFocusAfterModalClosing'"),
    ('"lib/hooks/usePreventFocusAfterModalClosing"','"client/shared/hooks/usePreventFocusAfterModalClosing"'),
    ("'lib/hooks/useTableViewValue'",              "'client/shared/hooks/useTableViewValue'"),
    ('"lib/hooks/useTableViewValue"',              '"client/shared/hooks/useTableViewValue"'),
    ("'lib/hooks/useUpdateValueEffect'",           "'client/shared/hooks/useUpdateValueEffect'"),
    ('"lib/hooks/useUpdateValueEffect"',           '"client/shared/hooks/useUpdateValueEffect"'),
]

# Function identifier renames (network→chain) applied repo-wide
FUNC_RENAMES = [
    # import renames: `import getNetworkTitle` → `import getChainTitle`
    # These appear as: import getNetworkTitle from ...  or  { getNetworkTitle }
    ('getNetworkTitle',              'getChainTitle'),
    ('getNetworkUtilizationParams',  'getChainUtilizationParams'),
    ('getNetworkValidationActionText','getChainValidationActionText'),
    ('getNetworkValidatorTitle',     'getChainValidatorTitle'),
    ('networkExplorers',             'chainExplorers'),
]

files = collect_files()
print(f"Scanning {len(files)} files...")

updated_count = 0
for fpath in files:
    try:
        content = read(fpath)
    except Exception:
        continue

    orig = content

    # Apply import path replacements
    for old, new in IMPORT_MAP:
        content = content.replace(old, new)

    if content != orig:
        write(fpath, content)
        updated_count += 1
        rel = os.path.relpath(fpath, ROOT)
        print(f"  {rel}")

print(f"\nPhase 3 done. Updated {updated_count} files.\n")

# ---------------------------------------------------------------------------
# Phase 4: network→chain function identifier renames (repo-wide)
# ---------------------------------------------------------------------------
print("=== Phase 4: network→chain identifier renames ===")

# We use word-boundary aware regex to avoid partial matches
updated_func = 0
for fpath in files:
    try:
        content = read(fpath)
    except Exception:
        continue

    orig = content
    for old, new in FUNC_RENAMES:
        # Use word boundaries
        content = re.sub(r'\b' + re.escape(old) + r'\b', new, content)

    if content != orig:
        write(fpath, content)
        updated_func += 1
        rel = os.path.relpath(fpath, ROOT)
        print(f"  {rel}")

print(f"\nPhase 4 done. Updated {updated_func} files.\n")

print("=== All phases complete. ===")
