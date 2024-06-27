import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

import config from 'configs/app';

const ROOT_DIR = './icons';
const NAME_PREFIX = ROOT_DIR.replace('./', '') + '/';

const getIconName = (filePath: string) => filePath.replace(NAME_PREFIX, '').replace('.svg', '');

function collectIconNames(dir: string) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let icons: Array<string> = [];

  files.forEach((file) => {
    const filePath = path.join(dir, file.name);
    file.name.endsWith('.svg') && icons.push(getIconName(filePath));

    if (file.isDirectory()) {
      icons = [ ...icons, ...collectIconNames(filePath) ];
    }
  });

  return icons;
}

export default async function spriteHandler(req: NextApiRequest, res: NextApiResponse) {

  if (!config.app.isDev) {
    return res.status(404).json({ error: 'Not found' });
  }

  const icons = collectIconNames(ROOT_DIR);

  res.status(200).json({
    icons,
  });
}
