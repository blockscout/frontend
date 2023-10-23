import type { LuksoButton } from '@lukso/web-components/dist/components/lukso-button';
import type { LuksoCard } from '@lukso/web-components/dist/components/lukso-card';
import type { LuksoCheckbox } from '@lukso/web-components/dist/components/lukso-checkbox';
import type { LuksoFooter } from '@lukso/web-components/dist/components/lukso-footer';
import type { LuksoIcon } from '@lukso/web-components/dist/components/lukso-icon';
import type { LuksoInput } from '@lukso/web-components/dist/components/lukso-input';
import type { LuksoModal } from '@lukso/web-components/dist/components/lukso-modal';
import type { LuksoNavbar } from '@lukso/web-components/dist/components/lukso-navbar';
import type { LuksoProfile } from '@lukso/web-components/dist/components/lukso-profile';
import type { LuksoProgress } from '@lukso/web-components/dist/components/lukso-progress';
import type { LuksoSanitize } from '@lukso/web-components/dist/components/lukso-sanitize';
import type { LuksoShare } from '@lukso/web-components/dist/components/lukso-share';
import type { LuksoTag } from '@lukso/web-components/dist/components/lukso-tag';
import type { LuksoTerms } from '@lukso/web-components/dist/components/lukso-terms';
import type { LuksoUsername } from '@lukso/web-components/dist/components/lukso-username';
import type { LuksoWizard } from '@lukso/web-components/dist/components/lukso-wizard';
import type * as React from 'react';

type WebComponent<T> =
    | (React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
    Partial<T>)
    | { children?: React.ReactNode; class?: string };

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lukso-navbar': WebComponent<LuksoNavbar>;
      'lukso-wizard': WebComponent<LuksoWizard> | { steps: string };
      'lukso-card': WebComponent<LuksoCard>;
      'lukso-checkbox': WebComponent<LuksoCheckbox>;
      'lukso-footer': WebComponent<LuksoFooter> | { providers: string };
      'lukso-username': WebComponent<LuksoUsername>;
      'lukso-button': WebComponent<LuksoButton>;
      'lukso-sanitize': WebComponent<LuksoSanitize>;
      'lukso-icon': WebComponent<LuksoIcon>;
      'lukso-modal': WebComponent<LuksoModal>;
      'lukso-terms': WebComponent<LuksoTerms>;
      'lukso-input': WebComponent<LuksoInput>;
      'lukso-profile': WebComponent<LuksoProfile>;
      'lukso-progress': WebComponent<LuksoProgress>;
      'lukso-share': WebComponent<LuksoShare>;
      'lukso-tag': WebComponent<LuksoTag>;
    }
  }

  interface Window {
    ethereum?: any;
    lukso?: any;
    grecaptcha?: any;
  }
}
