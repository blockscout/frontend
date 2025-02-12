import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

import config from 'configs/app';

const ROOT_DIR = './icons';
const NAME_PREFIX = ROOT_DIR.replace('./', '') + '/';

interface IconInfo {
  name: string;
  fileSize: number;
}

const getIconName = (filePath: string) => filePath.replace(NAME_PREFIX, '').replace('.svg', '');

function collectIconNames(dir: string) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let icons: Array<IconInfo> = [];

  files.forEach((file) => {
    const filePath = path.join(dir, file.name);
    const stats = fs.statSync(filePath);

    file.name.endsWith('.svg') && icons.push({
      name: getIconName(filePath),
      fileSize: stats.size,
    });

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
