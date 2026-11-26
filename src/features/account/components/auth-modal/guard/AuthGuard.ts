// SPDX-License-Identifier: LicenseRef-Blockscout

import dynamic from 'next/dynamic';

const AuthGuard = dynamic(() => import('./AuthGuardAuth0'), { ssr: false });

export default AuthGuard;
