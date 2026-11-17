export interface NodeRef {
  readonly fileKey: string;
  readonly nodeId: string;
}

const FILE_PATH = /^\/(?:design|file)\/([A-Za-z0-9]+)(?:\/branch\/([A-Za-z0-9]+))?(?:\/|$)/;
const NODE_ID_SEGMENT = '\\d+[-:]\\d+';
const NODE_ID = new RegExp(`^I?(${ NODE_ID_SEGMENT }(?:;${ NODE_ID_SEGMENT })*)$`);
const SEGMENT_SEPARATOR = /[-:]/;

// A node id is `A:B` for a node placed on the page and `I<A:B>;<C:D>…` for a node inside a
// component instance: the instance's id, then the internal ids down to the node. The URL form
// writes `-` for `:`; the canonical form is what the REST API keys its response by.
export function parseNodeId(raw: string): string | undefined {
  const match = NODE_ID.exec(raw.trim());
  if (match === null) return undefined;
  const segments = match[1].split(';').map((segment) => segment.split(SEGMENT_SEPARATOR).join(':'));
  return `${ segments.length > 1 ? 'I' : '' }${ segments.join(';') }`;
}

// The id in a form a file name can carry: `I1:2;3:4` → `I1-2_3-4`.
export function fileSafeNodeId(nodeId: string): string {
  return nodeId.replace(/:/g, '-').replace(/;/g, '_');
}

function parseUrl(input: string): URL | undefined {
  try {
    return new URL(input);
  } catch {
    return undefined;
  }
}

function isFigmaHost(hostname: string): boolean {
  return hostname === 'figma.com' || hostname.endsWith('.figma.com');
}

// A Figma node link: `https://www.figma.com/design/<fileKey>/<name>?node-id=<A>-<B>`. The node id is
// accepted in its URL form (`A-B`) and its canonical form (`A:B`), and is always returned canonical.
// A branch link carries `/branch/<branchKey>/` after the file key, and the REST API serves the
// branch's content under the branch key only, so that is the key returned.
export function parseNodeRef(input: string): NodeRef | undefined {
  const url = parseUrl(input);
  if (url === undefined || !isFigmaHost(url.hostname)) return undefined;
  const [ , mainKey, branchKey ] = FILE_PATH.exec(url.pathname) ?? [];
  const fileKey = branchKey ?? mainKey;
  const nodeId = parseNodeId(url.searchParams.get('node-id') ?? '');
  if (fileKey === undefined || nodeId === undefined) return undefined;
  return { fileKey, nodeId };
}
