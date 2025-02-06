"use strict";

// src/vercel-request-context.ts
var SYMBOL_FOR_REQ_CONTEXT = Symbol.for("@vercel/request-context");
function getContext() {
  const fromSymbol = globalThis;
  return fromSymbol[SYMBOL_FOR_REQ_CONTEXT]?.get?.() ?? {};
}

// src/next-request-context.ts
var import_async_hooks = require("async_hooks");
var name = "@next/request-context";
var NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for(name);
var INTERNAL_STORAGE_FIELD_SYMBOL = Symbol.for("internal.storage");
function getOrCreateContextSingleton() {
  const _globalThis = globalThis;
  if (!_globalThis[NEXT_REQUEST_CONTEXT_SYMBOL]) {
    const storage = new import_async_hooks.AsyncLocalStorage();
    const Context = {
      get: () => storage.getStore(),
      [INTERNAL_STORAGE_FIELD_SYMBOL]: storage
    };
    _globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = Context;
  }
  return _globalThis[NEXT_REQUEST_CONTEXT_SYMBOL];
}
var NextRequestContext = getOrCreateContextSingleton();
function withNextRequestContext(value, callback) {
  const storage = NextRequestContext[INTERNAL_STORAGE_FIELD_SYMBOL];
  return storage.run(value, callback);
}

// src/server-launcher.ts
process.chdir(__dirname);
var region = process.env.VERCEL_REGION || process.env.NOW_REGION;
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = region === "dev1" ? "development" : "production";
}
if (process.env.NODE_ENV !== "production" && region !== "dev1") {
  console.warn(
    `Warning: NODE_ENV was incorrectly set to "${process.env.NODE_ENV}", this value is being overridden to "production"`
  );
  process.env.NODE_ENV = "production";
}
// @preserve pre-next-server-target
var NextServer = require("next/dist/server/next-server.js").default;
// @preserve next-server-preload-target
const conf = {"env":{},"eslint":{"ignoreDuringBuilds":false},"typescript":{"ignoreBuildErrors":false,"tsconfigPath":"tsconfig.json"},"distDir":".next","cleanDistDir":true,"assetPrefix":"","cacheMaxMemorySize":52428800,"configOrigin":"next.config.js","useFileSystemPublicRoutes":true,"generateEtags":true,"pageExtensions":["tsx","ts","jsx","js"],"poweredByHeader":true,"compress":false,"images":{"deviceSizes":[640,750,828,1080,1200,1920,2048,3840],"imageSizes":[16,32,48,64,96,128,256,384],"path":"/_next/image","loader":"default","loaderFile":"","domains":[],"disableStaticImages":false,"minimumCacheTTL":60,"formats":["image/webp"],"dangerouslyAllowSVG":false,"contentSecurityPolicy":"script-src 'none'; frame-src 'none'; sandbox;","contentDispositionType":"attachment","remotePatterns":[],"unoptimized":false},"devIndicators":{"appIsrStatus":true,"buildActivity":true,"buildActivityPosition":"bottom-right"},"onDemandEntries":{"maxInactiveAge":60000,"pagesBufferLength":5},"amp":{"canonicalBase":""},"basePath":"","sassOptions":{},"trailingSlash":false,"i18n":null,"productionBrowserSourceMaps":true,"excludeDefaultMomentLocales":true,"serverRuntimeConfig":{},"publicRuntimeConfig":{},"reactProductionProfiling":false,"reactStrictMode":true,"reactMaxHeadersLength":6000,"httpAgentOptions":{"keepAlive":true},"logging":{},"expireTime":31536000,"staticPageGenerationTimeout":60,"output":"standalone","modularizeImports":{"@mui/icons-material":{"transform":"@mui/icons-material/{{member}}"},"lodash":{"transform":"lodash/{{member}}"}},"outputFileTracingRoot":"/Users/eugenevistajet/fluentlabs/blockscout-frontend","experimental":{"cacheLife":{"default":{"stale":180,"revalidate":900,"expire":4294967294},"seconds":{"stale":30,"revalidate":1,"expire":60},"minutes":{"stale":300,"revalidate":60,"expire":3600},"hours":{"stale":300,"revalidate":3600,"expire":86400},"days":{"stale":300,"revalidate":86400,"expire":604800},"weeks":{"stale":300,"revalidate":604800,"expire":2592000},"max":{"stale":300,"revalidate":2592000,"expire":4294967294}},"cacheHandlers":{},"multiZoneDraftMode":false,"appNavFailHandling":false,"prerenderEarlyExit":true,"serverMinification":true,"serverSourceMaps":false,"linkNoTouchStart":false,"caseSensitiveRoutes":false,"preloadEntriesOnStart":true,"clientRouterFilter":true,"clientRouterFilterRedirects":false,"fetchCacheKeyPrefix":"","middlewarePrefetch":"flexible","optimisticClientCache":true,"manualClientBasePath":false,"cpus":9,"memoryBasedWorkersCount":false,"imgOptConcurrency":null,"imgOptTimeoutInSeconds":7,"imgOptMaxInputPixels":268402689,"imgOptSequentialRead":null,"isrFlushToDisk":true,"workerThreads":false,"optimizeCss":false,"nextScriptWorkers":false,"scrollRestoration":false,"externalDir":false,"disableOptimizedLoading":false,"gzipSize":true,"craCompat":false,"esmExternals":true,"fullySpecified":false,"swcTraceProfiling":false,"forceSwcTransforms":false,"largePageDataBytes":128000,"turbo":{"root":"/Users/eugenevistajet/fluentlabs/blockscout-frontend"},"typedRoutes":false,"typedEnv":false,"parallelServerCompiles":false,"parallelServerBuildTraces":false,"ppr":false,"reactOwnerStack":false,"webpackMemoryOptimizations":false,"optimizeServerReact":true,"useEarlyImport":false,"staleTimes":{"dynamic":30,"static":180},"after":false,"serverComponentsHmrCache":true,"staticGenerationMaxConcurrency":8,"staticGenerationMinPagesPerWorker":25,"dynamicIO":false,"optimizePackageImports":["lucide-react","date-fns","lodash-es","ramda","antd","react-bootstrap","ahooks","@ant-design/icons","@headlessui/react","@headlessui-float/react","@heroicons/react/20/solid","@heroicons/react/24/solid","@heroicons/react/24/outline","@visx/visx","@tremor/react","rxjs","@mui/material","@mui/icons-material","recharts","react-use","effect","@effect/schema","@effect/platform","@effect/platform-node","@effect/platform-browser","@effect/platform-bun","@effect/sql","@effect/sql-mssql","@effect/sql-mysql2","@effect/sql-pg","@effect/sql-squlite-node","@effect/sql-squlite-bun","@effect/sql-squlite-wasm","@effect/sql-squlite-react-native","@effect/rpc","@effect/rpc-http","@effect/typeclass","@effect/experimental","@effect/opentelemetry","@material-ui/core","@material-ui/icons","@tabler/icons-react","mui-core","react-icons/ai","react-icons/bi","react-icons/bs","react-icons/cg","react-icons/ci","react-icons/di","react-icons/fa","react-icons/fa6","react-icons/fc","react-icons/fi","react-icons/gi","react-icons/go","react-icons/gr","react-icons/hi","react-icons/hi2","react-icons/im","react-icons/io","react-icons/io5","react-icons/lia","react-icons/lib","react-icons/lu","react-icons/md","react-icons/pi","react-icons/ri","react-icons/rx","react-icons/si","react-icons/sl","react-icons/tb","react-icons/tfi","react-icons/ti","react-icons/vsc","react-icons/wi"],"trustHostHeader":true,"isExperimentalCompile":false},"bundlePagesRouterDependencies":false,"configFileName":"next.config.js","transpilePackages":["react-syntax-highlighter","swagger-client","swagger-ui-react"],"_originalRewrites":{"beforeFiles":[],"afterFiles":[{"source":"/node-api/proxy/:slug*","destination":"/api/proxy"},{"source":"/node-api/:slug*","destination":"/api/:slug*"}],"fallback":[]},"_originalRedirects":[{"source":"/account/tag_address","destination":"/account/tag-address","permanent":false},{"source":"/account/tag_address/new","destination":"/account/tag-address","permanent":false},{"source":"/account/tag_transaction","destination":"/account/tag-address?tab=tx","permanent":false},{"source":"/account/tag_transaction/new","destination":"/account/tag-address?tab=tx","permanent":false},{"source":"/account/watchlist_address/:id/edit","destination":"/account/watchlist","permanent":false},{"source":"/account/watchlist_address/new","destination":"/account/watchlist","permanent":false},{"source":"/account/api_key","destination":"/account/api-key","permanent":false},{"source":"/account/api_key/:id/edit","destination":"/account/api-key","permanent":false},{"source":"/account/api_key/new","destination":"/account/api-key","permanent":false},{"source":"/account/custom_abi","destination":"/account/custom-abi","permanent":false},{"source":"/account/custom_abi/:id/edit","destination":"/account/custom-abi","permanent":false},{"source":"/account/custom_abi/new","destination":"/account/custom-abi","permanent":false},{"source":"/account/public-tags-request","destination":"/public-tags/submit","permanent":false},{"source":"/pending-transactions","destination":"/txs?tab=pending","permanent":false},{"source":"/tx/:hash/internal-transactions","destination":"/tx/:hash?tab=internal","permanent":false},{"source":"/tx/:hash/logs","destination":"/tx/:hash?tab=logs","permanent":false},{"source":"/tx/:hash/raw-trace","destination":"/tx/:hash?tab=raw_trace","permanent":false},{"source":"/tx/:hash/state","destination":"/tx/:hash?tab=state","permanent":false},{"source":"/tx/:hash/token-transfers","destination":"/tx/:hash?tab=token_transfers","permanent":false},{"source":"/blocks/:height/:path*","destination":"/block/:height/:path*","permanent":false},{"source":"/uncles","destination":"/blocks?tab=uncles","permanent":false},{"source":"/reorgs","destination":"/blocks?tab=reorgs","permanent":false},{"source":"/block/:height/transactions","destination":"/block/:height?tab=txs","permanent":false},{"source":"/block/:height/withdrawals","destination":"/block/:height?tab=withdrawals","permanent":false},{"source":"/address/:hash/transactions","destination":"/address/:hash","permanent":false},{"source":"/address/:hash/token-transfers","destination":"/address/:hash?tab=token_transfers","permanent":false},{"source":"/address/:hash/tokens","destination":"/address/:hash?tab=tokens","permanent":false},{"source":"/address/:hash/internal-transactions","destination":"/address/:hash?tab=internal_txns","permanent":false},{"source":"/address/:hash/coin-balances","destination":"/address/:hash?tab=coin_balance_history","permanent":false},{"source":"/address/:hash/logs","destination":"/address/:hash?tab=logs","permanent":false},{"source":"/address/:hash/validations","destination":"/address/:hash?tab=blocks_validated","permanent":false},{"source":"/address/:hash/contracts","destination":"/address/:hash?tab=contract","permanent":false},{"source":"/address/:hash/read-contract","destination":"/address/:hash?tab=read_contract","permanent":false},{"source":"/address/:hash/read-proxy","destination":"/address/:hash?tab=read_proxy","permanent":false},{"source":"/address/:hash/write-contract","destination":"/address/:hash?tab=write_contract","permanent":false},{"source":"/address/:hash/write-proxy","destination":"/address/:hash?tab=write_proxy","permanent":false},{"source":"/address/:hash/tokens/:token_hash/token-transfers","destination":"/address/:hash?tab=token_transfers&token=:token_hash","permanent":false},{"source":"/address/:hash/contract_verifications/new","destination":"/address/:hash/contract_verification","permanent":false},{"source":"/address/:hash/verify-via-flattened-code/new","destination":"/address/:hash/contract_verification?method=flatten_source_code","permanent":false},{"source":"/address/:hash/verify-via-standard-json-input/new","destination":"/address/:hash/contract_verification?method=standard_input","permanent":false},{"source":"/address/:hash/verify-via-metadata-json/new","destination":"/address/:hash/contract_verification?method=sourcify","permanent":false},{"source":"/address/:hash/verify-via-multi-part-files/new","destination":"/address/:hash/contract_verification?method=multi_part_file","permanent":false},{"source":"/address/:hash/verify-vyper-contract/new","destination":"/address/:hash/contract_verification?method=vyper_contract","permanent":false},{"source":"/bridged-tokens","destination":"/tokens/?tab=bridged","permanent":false},{"source":"/bridged-tokens/:chain_name","destination":"/tokens/?tab=bridged","permanent":false},{"source":"/tokens/:hash/:path*","destination":"/token/:hash/:path*","permanent":false},{"source":"/token/:hash/token-transfers","destination":"/token/:hash/?tab=token_transfers","permanent":false},{"source":"/token/:hash/token-holders","destination":"/token/:hash/?tab=holders","permanent":false},{"source":"/token/:hash/inventory","destination":"/token/:hash/?tab=inventory","permanent":false},{"source":"/token/:hash/instance/:id/token-transfers","destination":"/token/:hash/instance/:id","permanent":false},{"source":"/token/:hash/instance/:id/token-holders","destination":"/token/:hash/instance/:id?tab=holders","permanent":false},{"source":"/token/:hash/instance/:id/metadata","destination":"/token/:hash/instance/:id?tab=metadata","permanent":false},{"source":"/token/:hash/read-contract","destination":"/token/:hash?tab=read_contract","permanent":false},{"source":"/token/:hash/read-proxy","destination":"/token/:hash?tab=read_proxy","permanent":false},{"source":"/token/:hash/write-contract","destination":"/token/:hash?tab=write_contract","permanent":false},{"source":"/token/:hash/write-proxy","destination":"/token/:hash?tab=write_proxy","permanent":false},{"source":"/l2-txn-batches","destination":"/batches","permanent":false},{"source":"/zkevm-l2-txn-batches","destination":"/batches","permanent":false},{"source":"/zkevm-l2-txn-batch/:path*","destination":"/batches/:path*","permanent":false},{"source":"/l2-deposits","destination":"/deposits","permanent":false},{"source":"/l2-withdrawals","destination":"/withdrawals","permanent":false},{"source":"/l2-output-roots","destination":"/output-roots","permanent":false}]};
var nextServer = new NextServer({
  conf,
  dir: ".",
  minimalMode: true,
  customServer: false
});
var serve = (handler) => async (req, res) => {
  try {
    const vercelContext = getContext();
    await withNextRequestContext(
      { waitUntil: vercelContext.waitUntil },
      () => {
        // @preserve entryDirectory handler
        return handler(req, res);
      }
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
module.exports = serve(nextServer.getRequestHandler());
if (conf.experimental?.ppr && "getRequestHandlerWithMetadata" in nextServer && typeof nextServer.getRequestHandlerWithMetadata === "function") {
  module.exports.getRequestHandlerWithMetadata = (metadata) => serve(nextServer.getRequestHandlerWithMetadata(metadata));
}
if (process.env.NEXT_PRIVATE_PRELOAD_ENTRIES) {
  module.exports.preload = nextServer.unstable_preloadEntries.bind(nextServer);
}
