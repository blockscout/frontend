// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as adminRs from '@blockscout/admin-rs-types';

import { Alert } from 'src/toolkit/chakra/alert';

interface Props {
  application?: adminRs.TokenInfoSubmission;
}

const TokenInfoFormStatusText = ({ application }: Props) => {

  if (!application) {
    return null;
  }

  switch (application.status) {
    case adminRs.TokenInfoSubmissionStatus.IN_PROCESS: {
      return (
        <div>
          <div>Requests are sent to a moderator for review and approval. This process can take several days.</div>
          <Alert status="warning" mt={ 6 }>Request in progress. Once an admin approves your request you can edit token info.</Alert>
        </div>
      );
    }

    case adminRs.TokenInfoSubmissionStatus.UPDATE_REQUIRED: {
      return (
        <div>
          { application.adminComments && <Alert status="warning" mt={ 6 }>{ application.adminComments }</Alert> }
        </div>
      );
    }

    case adminRs.TokenInfoSubmissionStatus.REJECTED: {
      return (
        <div>
          { application.adminComments && <Alert status="warning" mt={ 6 }>{ application.adminComments }</Alert> }
        </div>
      );
    }

    default:
      return null;
  }
};

export default React.memo(TokenInfoFormStatusText);
