#!/usr/bin/env python3
"""Extract the loading-performance metrics of issue #3566 from Chrome DevTools traces.

Usage:
    python3 trace-metrics.py <trace.json>                       # metrics for one trace
    python3 trace-metrics.py <baseline.json> <candidate.json>   # side-by-side comparison

Traces are recorded with the DevTools Performance panel (see README.md next to this
script for the full measurement protocol). The script auto-detects the main-frame
navigation to localhost and reports everything relative to its navigationStart.

Metrics (the row ids match the "Impact tracking" table in spec.md):
    M1  First Contentful Paint (= LCP for this page; the LCP element is a text block)
    M2  first main-page API request start
    M3  main-page/transactions response received (backend-latency dependent!)
    M4  content rendered (end of the first render commit after M3)
    M5  main-thread blocking time (sum of long-task time above 50 ms, whole trace)
    M6  JS transferred before FCP (gzipped bytes over the network)
"""
import json
import sys


def analyze(path):
    with open(path) as f:
        events = json.load(f)["traceEvents"]

    thread_names = {}
    for e in events:
        if e.get("ph") == "M" and e.get("name") == "thread_name":
            thread_names[(e["pid"], e["tid"])] = e["args"]["name"]

    navigations = sorted(
        (e["ts"], e["pid"])
        for e in events
        if e.get("name") == "navigationStart" and
        "localhost" in e.get("args", {}).get("data", {}).get("documentLoaderURL", "") and
        e.get("args", {}).get("data", {}).get("isLoadingMainFrame")
    )
    if not navigations:
        raise SystemExit(f"{path}: no main-frame navigation to localhost found")
    t0, pid = navigations[0]

    def ms(ts):
        return (ts - t0) / 1000.0

    r = {"path": path}

    # M1 — FCP
    r["M1_fcp"] = next(
        (ms(e["ts"]) for e in events if e.get("name") == "firstContentfulPaint" and e.get("pid") == pid),
        None,
    )

    # network: send/finish per request id
    send, fin = {}, {}
    for e in events:
        n = e.get("name")
        if n == "ResourceSendRequest":
            send[e["args"]["data"]["requestId"]] = (e["ts"], e["args"]["data"])
        elif n == "ResourceFinish":
            fin[e["args"]["data"]["requestId"]] = (e["ts"], e["args"]["data"])

    api, tx_done_ts = [], None
    for rid, (ts, d) in send.items():
        url = d.get("url", "")
        if "/node-api/proxy/" in url or "/api/v2/" in url or "stats-service" in url:
            f = fin.get(rid)
            api.append((ms(ts), (f[0] - ts) / 1000.0 if f else None, url))
            if url.rstrip("/").endswith("main-page/transactions") and f and tx_done_ts is None:
                tx_done_ts = f[0]
    api.sort()
    r["api"] = [(s, d, u.split("/node-api/proxy")[-1].split("localhost:3000")[-1][:70]) for s, d, u in api]
    r["M2_first_api_start"] = api[0][0] if api else None
    r["M3_tx_data_ready"] = ms(tx_done_ts) if tx_done_ts else None

    # M4 — end of the first render commit (Commit event on the renderer main thread)
    # that starts after the transactions response; falls back to M3.
    r["M4_content_rendered"] = r["M3_tx_data_ready"]
    if tx_done_ts:
        commits = sorted(
            (e["ts"], e.get("dur", 0))
            for e in events
            if e.get("name") == "Commit" and e.get("ph") == "X" and e.get("pid") == pid and
            thread_names.get((e["pid"], e["tid"])) == "CrRendererMain" and e["ts"] >= tx_done_ts
        )
        if commits:
            ts, dur = commits[0]
            r["M4_content_rendered"] = ms(ts + dur)

    # M5 — blocking time from long tasks
    r["M5_blocking_time"] = sum(
        (e["dur"] - 50000) / 1000.0
        for e in events
        if e.get("name") == "RunTask" and e.get("ph") == "X" and e.get("dur", 0) > 50000 and
        e.get("pid") == pid and thread_names.get((e["pid"], e["tid"])) == "CrRendererMain"
    )

    # M6 — JS bytes transferred before FCP
    fcp_abs = t0 + (r["M1_fcp"] or 0) * 1000
    receive = {}
    for e in events:
        if e.get("name") == "ResourceReceiveResponse":
            receive[e["args"]["data"]["requestId"]] = e["args"]["data"]
    js_bytes = sum(
        (f[1].get("encodedDataLength") or 0)
        for rid, f in fin.items()
        if f[0] <= fcp_abs and "javascript" in (receive.get(rid, {}).get("mimeType") or "")
    )
    r["M6_js_before_fcp_kb"] = js_bytes / 1024.0

    return r


ROWS = [
    ("M1_fcp", "M1  First Contentful Paint", "ms"),
    ("M2_first_api_start", "M2  first API request start", "ms"),
    ("M3_tx_data_ready", "M3  transactions data ready", "ms"),
    ("M4_content_rendered", "M4  content rendered", "ms"),
    ("M5_blocking_time", "M5  blocking time (TBT-ish)", "ms"),
    ("M6_js_before_fcp_kb", "M6  JS before FCP", "KB gz"),
]


def fmt(v, unit):
    return "—" if v is None else f"{v:7.0f} {unit}"


results = [analyze(p) for p in sys.argv[1:]]
if not results:
    raise SystemExit(__doc__)

for r in results:
    print(f"\n### {r['path']}")
    for key, label, unit in ROWS:
        print(f"  {label:32} {fmt(r.get(key), unit)}")
    print("  API requests (start / dur):")
    for s, d, u in r["api"]:
        dd = "?" if d is None else f"{d:.0f}"
        print(f"    {s:8.0f} ms  {dd:>6} ms  {u}")

if len(results) == 2:
    a, b = results
    print(f"\n### comparison (candidate vs baseline)")
    for key, label, unit in ROWS:
        va, vb = a.get(key), b.get(key)
        if va is None or vb is None:
            continue
        print(f"  {label:32} {va:7.0f} -> {vb:7.0f} {unit}  ({vb - va:+.0f})")
    print("\nNOTE: M3/M4 depend on backend latency, which varies run-to-run —")
    print("compare medians of several runs, or judge levers by M1/M2/M5/M6.")
