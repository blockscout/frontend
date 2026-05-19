import type { BadgeProps } from '@chakra-ui/react';
import React from 'react';

import type { PublicTagApplicationStatus } from 'types/api/publicTagSubmissions';

import { Badge } from 'toolkit/chakra/badge';
import { Tooltip } from 'toolkit/chakra/tooltip';

const STATUS_VARIANTS: Record<PublicTagApplicationStatus, { colorPalette: BadgeProps['colorPalette']; label: string }> = {
  pending: { colorPalette: 'orange', label: 'Pending review' },
  approved: { colorPalette: 'green', label: 'Approved' },
  rejected: { colorPalette: 'red', label: 'Rejected' },
};

interface Props {
  status: PublicTagApplicationStatus;
  reason?: string | null;
}

const PublicTagApplicationStatusBadge = ({ status, reason }: Props) => {
  const { colorPalette, label } = STATUS_VARIANTS[status];
  const badge = <Badge colorPalette={ colorPalette }>{ label }</Badge>;

  if (status === 'rejected' && reason) {
    return (
      <Tooltip content={ reason }>
        { badge }
      </Tooltip>
    );
  }

  return badge;
};

export default React.memo(PublicTagApplicationStatusBadge);
