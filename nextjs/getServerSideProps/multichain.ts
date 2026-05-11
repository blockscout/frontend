import * as guards from './guards';
import { factoryMultichain } from './utils';

export const base = factoryMultichain([ guards.multichain ]);
export const userOps = factoryMultichain([ guards.multichain, guards.userOps ]);
export const accountsLabelSearch = factoryMultichain([ guards.multichain, guards.accountsLabelSearch ]);
export const advancedFilter = factoryMultichain([ guards.multichain, guards.advancedFilter ]);
