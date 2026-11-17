// Resolves on the next macrotask, once every pending microtask has run. Await it after an action
// that starts async work (a click whose handler triggers a fetch, say) and before asserting on the
// outcome.

const scheduler = setTimeout;

export default function flushPromises() {
  return new Promise(function(resolve) {
    scheduler(resolve);
  });
}
