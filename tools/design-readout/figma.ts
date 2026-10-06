import { FIGMA_API_BASE, TOKEN_ENV } from './config';
import type { NodeRef } from './url';

export interface BoundingBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface FigmaColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

export interface FigmaPaint {
  readonly type: string;
  readonly visible?: boolean;
  readonly opacity?: number;
  readonly color?: FigmaColor;
}

export interface FigmaTextStyle {
  readonly fontFamily?: string;
  readonly fontWeight?: number;
  readonly fontSize?: number;
  readonly lineHeightPx?: number;
}

// The subset of a REST node this tool reads; the payload carries far more and is dumped verbatim.
export interface FigmaNode {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly visible?: boolean;
  readonly opacity?: number;
  readonly children?: ReadonlyArray<FigmaNode>;
  readonly absoluteBoundingBox?: BoundingBox | null;
  readonly exposedInstances?: ReadonlyArray<string>;
  readonly fills?: ReadonlyArray<FigmaPaint>;
  readonly strokes?: ReadonlyArray<FigmaPaint>;
  readonly characters?: string;
  readonly style?: FigmaTextStyle;
  readonly componentId?: string;
  // Property (`fill`, `text`, `stroke`, …) → style id, resolved by the entry's `styles` map.
  readonly styles?: Readonly<Record<string, string>>;
}

export interface FigmaStyle {
  readonly name: string;
  readonly styleType: string;
}

export interface FigmaComponent {
  readonly name: string;
}

export interface NodeEntry {
  readonly document: FigmaNode;
  readonly styles?: Readonly<Record<string, FigmaStyle>>;
  readonly components?: Readonly<Record<string, FigmaComponent>>;
}

// `GET /v1/files/:key/nodes`: file metadata plus one entry per requested id, `null` when the id is
// not in the file.
export interface NodesResponse {
  readonly name: string;
  readonly lastModified: string;
  readonly version: string;
  readonly nodes: Readonly<Record<string, NodeEntry | null>>;
}

export class FigmaFetchError extends Error {}

export type Env = Readonly<Record<string, string | undefined>>;

function readToken(env: Env): string {
  const token = env[TOKEN_ENV]?.trim();
  if (token === undefined || token === '') {
    throw new FigmaFetchError(`No Figma token: export ${ TOKEN_ENV } (a personal access token) and run again.`);
  }
  return token;
}

function describeFailure(status: number): string {
  if (status === 401 || status === 403) {
    return `Figma rejected the token (HTTP ${ status }); personal access tokens expire after at most 90 days.`;
  }
  if (status === 404) return 'Figma returned 404: the file key is wrong or the token has no access to the file.';
  return `Figma nodes request failed with HTTP ${ status }.`;
}

// eslint-disable-next-line no-restricted-properties -- Node CLI reading its own token from the shell, not an app env var
export async function fetchNodes(ref: NodeRef, env: Env = process.env): Promise<NodesResponse> {
  const token = readToken(env);
  const url = `${ FIGMA_API_BASE }/v1/files/${ ref.fileKey }/nodes?ids=${ encodeURIComponent(ref.nodeId) }`;
  const response = await fetch(url, { headers: { 'X-Figma-Token': token } });
  if (!response.ok) throw new FigmaFetchError(describeFailure(response.status));
  return await response.json() as NodesResponse;
}

export function entryOf(payload: NodesResponse, nodeId: string): NodeEntry {
  const entry = payload.nodes[nodeId];
  if (entry === undefined || entry === null) throw new FigmaFetchError(`Node ${ nodeId } is not in file "${ payload.name }".`);
  return entry;
}

export function rootOf(payload: NodesResponse, nodeId: string): FigmaNode {
  return entryOf(payload, nodeId).document;
}
