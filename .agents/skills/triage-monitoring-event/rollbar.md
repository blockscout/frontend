# Rollbar

The provider part of the `triage-monitoring-event` skill.

Rollbar is reached through its MCP server (`@rollbar/mcp-server`, tools prefixed `mcp__rollbar__`).
The tool schemas are the manual for names and parameters; this file holds only what they cannot say.

## Precheck

Call the cheapest read: list the projects. Three ways it fails, each a stop with its remedy:

- **No `mcp__rollbar__*` tools in the session** — the server is not configured. Add it to the MCP
  config with the token in its environment:
  `claude mcp add rollbar -e ROLLBAR_ACCOUNT_ACCESS_TOKEN=<token> -- npx -y @rollbar/mcp-server`.
- **Auth error** — `ROLLBAR_ACCOUNT_ACCESS_TOKEN` is missing or wrong in the server's environment. It
  is an account access token (Rollbar → account settings → Account Access Tokens) with **read and
  write** scope; read-only cannot mute.
- **Project list without `Frontend`** — the token belongs to another account. Same remedy.

Other token sources the server accepts (`ROLLBAR_ACCESS_TOKEN`, `.rollbar-mcp.json`) are in its README;
the variable above is the one this skill expects.

## Reading an event

- An event is an **item**. The URL ends `/item/Frontend/<counter>`; the counter, plus the project
  `Frontend`, is what the read tools take.
- Fetch the item details, then list occurrences with a limit of five or so. Occurrences carry the page
  under `request.url`, the user agent under `client.javascript.browser`, the release under
  `code_version` and the console trail under `body.telemetry`.
- **Frames are minified and no source maps are uploaded**, so file, line and column in the trace name
  nothing. Only the message, the page, the telemetry and the release locate the code.

## Muting

Update the item to status `muted`. The update tool takes the item's numeric **`id`** from the details
response (the long one, `1806137227`-shaped) — **not** the counter from the URL. They are different numbers.
