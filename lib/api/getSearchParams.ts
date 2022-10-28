import type { NextApiRequest } from 'next';

export default function getSearchParams(req: NextApiRequest) {
  const searchParams: Record<string, string> = {};
  Object.entries(req.query).forEach(([ key, value ]) => {
    searchParams[key] = Array.isArray(value) ? value.join(',') : (value || '');
  });

  return new URLSearchParams(searchParams).toString();
}
