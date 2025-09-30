import type { Feature } from "./types";

import apis from "../apis";

const title = "Blockchain statistics";

const config: Feature<{}> = (() => {
  if (apis.stats) {
    return Object.freeze({
      title,
      isEnabled: false,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
