import fs from 'fs';
import path from 'path';

/* eslint-disable no-console */
const PRESETS = {
  arbitrum: 'https://arbitrum.blockscout.com',
  arbitrum_sepolia: 'https://arbitrum-sepolia.blockscout.com',
  base: 'https://base.blockscout.com',
  blackfort_testnet: 'https://blackfort-testnet.blockscout.com',
  celo_alfajores: 'https://celo-alfajores.blockscout.com',
  eth: 'https://eth.blockscout.com',
  eth_goerli: 'https://eth-goerli.blockscout.com',
  eth_sepolia: 'https://eth-sepolia.blockscout.com',
  garnet: 'https://explorer.garnetchain.com',
  filecoin: 'https://filecoin.blockscout.com',
  gnosis: 'https://gnosis.blockscout.com',
  optimism: 'https://optimism.blockscout.com',
  optimism_celestia: 'https://opcelestia-raspberry.gelatoscout.com',
  optimism_sepolia: 'https://optimism-sepolia.blockscout.com',
  polygon: 'https://polygon.blockscout.com',
  rootstock_testnet: 'https://rootstock-testnet.blockscout.com',
  scroll_sepolia: 'https://scroll-sepolia.blockscout.com',
  shibarium: 'https://www.shibariumscan.io',
  stability_testnet: 'https://stability-testnet.blockscout.com',
  zkevm: 'https://zkevm.blockscout.com',
  zksync: 'https://zksync.blockscout.com',
  zilliqa_prototestnet: 'https://zilliqa-prototestnet.blockscout.com',
  zora: 'https://explorer.zora.energy',
  // main === staging
  main: 'https://eth-sepolia.k8s-dev.blockscout.com',
};

const LOCAL_ENVS = {
  NEXT_PUBLIC_APP_PROTOCOL: 'http',
  NEXT_PUBLIC_APP_HOST: 'localhost',
  NEXT_PUBLIC_APP_PORT: '3000',
  NEXT_PUBLIC_APP_ENV: 'development',
  NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL: 'ws',
};

const IGNORED_ENVS = [
  'NEXT_PUBLIC_GIT_COMMIT_SHA',
  'NEXT_PUBLIC_GIT_TAG',
];

function parseScriptArgs() {
  const args = process.argv.slice(2);

  const result: Record<string, string> = {};
  args.forEach(arg => {
    const [ key, value ] = arg.split('=');
    if (key && value) {
      result[key.replace(/^--/, '') as keyof typeof result] = value;
    }
  });

  return result;
}

function getSecretEnvsList() {
  const fileContent = fs.readFileSync(path.resolve(__dirname, '../../.env.example'), 'utf8');
  const result = fileContent.split('\n').map((line) => line.split('=')[0]);
  return result;
}

function updateFileContent(envsEntries: Array<[ string, string ]>, presetId: keyof typeof PRESETS) {
  const presetEnvsContent = envsEntries
    .map(([ key, value ]) => `${ key }=${ value }`)
    .join('\n');

  const chainName = envsEntries.find(([ key ]) => key === 'NEXT_PUBLIC_NETWORK_NAME')?.[1] ?? 'Unknown';

  const explorerUrl = PRESETS[presetId];

  const localEnvsContent = Object.entries(LOCAL_ENVS)
    .map(([ key, value ]) => `${ key }=${ value }`)
    .join('\n');

  const content =
    `# Set of ENVs for ${ chainName } network explorer\n` +
    '# ' + explorerUrl + '\n' +
    `# This is an auto-generated file. To update all values, run "yarn dev:preset:sync --name=${ presetId }"\n` +
    '\n' +
    '# Local ENVs\n' +
    localEnvsContent + '\n' +
    '\n' +
    '# Instance ENVs\n' +
    presetEnvsContent;

  fs.writeFileSync(path.resolve(__dirname, `../../configs/envs/.env.${ presetId }`), content);
}

async function updatePresetFile(presetId: keyof typeof PRESETS) {
  const secretEnvs = getSecretEnvsList();

  const instanceUrl = PRESETS[presetId];
  const response = await fetch(`${ instanceUrl }/node-api/config`);
  const instanceConfig = await response.json() as Record<'envs', Record<string, string>>;

  const ignoredEnvs = [
    ...Object.keys(LOCAL_ENVS),
    ...IGNORED_ENVS,
    ...secretEnvs,
  ];

  const presetEnvsEntries = Object.entries(instanceConfig.envs)
    .filter(([ key ]) => !ignoredEnvs.includes(key));

  updateFileContent(presetEnvsEntries, presetId);
}

async function run() {
  console.log(`🌀 Syncing preset configuration file...`);

  const args = parseScriptArgs();
  if (!args.name) {
    console.log('🚨 No "--name" argument is provided. Exiting...');
    return;
  }

  const presetId = args.name as keyof typeof PRESETS;
  const instanceUrl = PRESETS[presetId];
  if (!instanceUrl) {
    console.log(`🚨 No preset with name "${ presetId }" found. Exiting...`);
    return;
  }

  await updatePresetFile(presetId);

  console.log(`✅ Done!`);
}

run();
