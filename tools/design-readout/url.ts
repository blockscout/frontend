export interface NodeRef {
  readonly fileKey: string;
  readonly nodeId: string;
}

const FILE_PATH = /^\/(?:design|file)\/([A-Za-z0-9]+)(?:\/|$)/;
const NODE_ID = /^(\d+)[-:](\d+)$/;

function parseUrl(input: string): URL | undefined {
  try {
    return new URL(input);
  } catch {
    return undefined;
  }
}

// A Figma node link: `https://www.figma.com/design/<fileKey>/<name>?node-id=<A>-<B>`. The node id is
// accepted in its URL form (`A-B`) and its canonical form (`A:B`), and is always returned canonical.
export function parseNodeRef(input: string): NodeRef | undefined {
  const url = parseUrl(input);
  if (url === undefined || !url.hostname.endsWith('figma.com')) return undefined;
  const fileKey = FILE_PATH.exec(url.pathname)?.[1];
  const nodeId = NODE_ID.exec(url.searchParams.get('node-id') ?? '');
  if (fileKey === undefined || nodeId === null) return undefined;
  return { fileKey, nodeId: `${ nodeId[1] }:${ nodeId[2] }` };
}
