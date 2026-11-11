#!/bin/bash
# Hook logger for session.sh: append the event payload to $PROBE_LOG.
cat >> "${PROBE_LOG:-/dev/null}"; echo >> "${PROBE_LOG:-/dev/null}"
