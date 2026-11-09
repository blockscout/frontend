import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const NAME = 'NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE';
const LINK = 'https://keeperwallet.com/download?utm_source=blockscout#mobile';
const MAKE_ENVS_SCRIPT = path.resolve('deploy/scripts/make_envs_script.sh');

const buildBrowserEnvs = (value: string): Record<string, string> => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'envs-js-'));
  const file = path.join(dir, 'envs.js');
  try {
    // eslint-disable-next-line no-restricted-properties -- the script runs in a child shell that needs the parent's environment
    execFileSync('bash', [ MAKE_ENVS_SCRIPT, file ], { cwd: dir, env: { ...process.env, [NAME]: value } });
    const browserGlobal: { __envs?: Record<string, string> } = {};
    new Function('window', fs.readFileSync(file, 'utf8'))(browserGlobal);
    return browserGlobal.__envs ?? {};
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
};

const resolveMessage = async(value: string, side: 'server' | 'browser'): Promise<string> => {
  return withEnvs([ [ NAME, value ] ], async() => {
    if (side === 'browser') {
      vi.stubGlobal('window', { __envs: buildBrowserEnvs(value) });
    }
    const { 'default': config } = await import('./config');
    return config.maintenanceAlert.message;
  });
};

const SIDES = [ 'server', 'browser' ] as const;

const ITEMS_DOUBLE_QUOTED_HREF = [
  `Keeper on Ethereum. <a href="${ LINK }">Download now</a>`,
  `Keeper on Base. <a href="${ LINK }">Download now</a>`,
];
const ITEMS_SINGLE_QUOTED_HREF = [
  `Keeper on Ethereum. <a href='${ LINK }'>Download now</a>`,
  `Keeper's on Base. <a href='${ LINK }'>Download now</a>`,
];

describe('maintenance alert', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each(SIDES)('shows a single HTML message as set on the %s', async(side) => {
    expect(await resolveMessage(`Keeper. <a href="${ LINK }">Download now</a>`, side)).toBe(`Keeper. <a href="${ LINK }">Download now</a>`);
  });

  it.each(SIDES)('rotates single-quoted plain-text items on the %s', async(side) => {
    expect([ 'Hello', 'Duck me' ]).toContain(await resolveMessage('[\'Hello\',\'Duck me\']', side));
  });

  it.each(SIDES)('rotates JSON items whose HTML has escaped double-quoted attributes on the %s', async(side) => {
    expect(ITEMS_DOUBLE_QUOTED_HREF).toContain(await resolveMessage(JSON.stringify(ITEMS_DOUBLE_QUOTED_HREF), side));
  });

  it.each(SIDES)('rotates JSON items whose HTML has single-quoted attributes on the %s', async(side) => {
    expect(ITEMS_SINGLE_QUOTED_HREF).toContain(await resolveMessage(JSON.stringify(ITEMS_SINGLE_QUOTED_HREF), side));
  });
});
