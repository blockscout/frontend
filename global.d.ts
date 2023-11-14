import type { WindowProvider } from "wagmi";
import type { LuksoProfile } from "@lukso/web-components/dist/components/lukso-profile";
import type * as React from "react";

type CPreferences = {
  zone: string;
  width: string;
  height: string;
};

type WebComponent<T> =
  | (React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
      Partial<T>)
  | { children?: React.ReactNode; class?: string };

declare global {
  export interface Window {
    ethereum?: WindowProvider;
    coinzilla_display: Array<CPreferences>;
    ga?: {
      getAll: () => Array<{ get: (prop: string) => string }>;
    };
    AdButler: {
      ads: Array<unknown>;
      register: (...args: unknown) => void;
    };
    abkw: string;
    __envs: Record<string, string>;
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
    }
  }

  namespace JSX {
    interface IntrinsicElements {
      "lukso-profile": WebComponent<LuksoProfile>;
    }
  }
}
