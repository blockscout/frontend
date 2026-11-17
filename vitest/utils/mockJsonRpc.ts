/* global fetchMock -- provided by vitest-fetch-mock in vitest/setup.ts */

// Routes the global fetch mock between the REST API and the JSON-RPC node.
//
// viem's http transport posts `{ jsonrpc, id, method, params }` through the global `fetch`, so the same
// `vitest-fetch-mock` that serves API responses can answer RPC calls. Every RPC method not listed in
// `rpc` answers `null`, which viem turns into its *NotFound errors (transaction, receipt, block).
//
//   mockApiAndRpc({
//     api: (url) => url.includes('/transactions/') ? { status: 404, body: '{"message":"Not found"}' } : undefined,
//     rpc: { eth_getTransactionByHash: RPC_TX },
//   });

interface ApiResponse {
  status?: number;
  body: string;
}

interface Params {
  api: (url: string) => ApiResponse | Promise<ApiResponse> | undefined;
  rpc?: Record<string, unknown>;
}

const JSON_HEADERS = { 'Content-Type': 'application/json' };

function parseRpcMethod(body: unknown): string | undefined {
  if (typeof body !== 'string') {
    return;
  }

  try {
    const parsed = JSON.parse(body) as { jsonrpc?: string; method?: string };
    return parsed.jsonrpc ? parsed.method : undefined;
  } catch {
    return;
  }
}

export function mockApiAndRpc({ api, rpc = {} }: Params) {
  fetchMock.mockResponse(async(request) => {
    const text = request.method === 'POST' ? await request.text() : undefined;
    const rpcMethod = parseRpcMethod(text);

    if (rpcMethod) {
      const { id } = JSON.parse(text as string) as { id: number };
      return {
        status: 200,
        headers: JSON_HEADERS,
        body: JSON.stringify({ jsonrpc: '2.0', id, result: rpc[rpcMethod] ?? null }),
      };
    }

    const response = await api(request.url);

    if (!response) {
      throw new Error(`Unexpected API request: ${ request.url }`);
    }

    return { status: response.status ?? 200, headers: JSON_HEADERS, body: response.body };
  });
}

export function rpcRequests(): Array<string> {
  return fetchMock.mock.calls
    .map(([ , init ]) => parseRpcMethod(init?.body))
    .filter((method): method is string => Boolean(method));
}

export function apiRequests(): Array<string> {
  return fetchMock.mock.calls
    .filter(([ , init ]) => !parseRpcMethod(init?.body))
    .map(([ input ]) => input instanceof Request ? input.url : String(input));
}
