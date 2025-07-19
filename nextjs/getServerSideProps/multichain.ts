import * as guards from './guards';
import { factoryMultichain } from './utils';

export const base = factoryMultichain([ guards.opSuperchain ]);
export const userOps = factoryMultichain([ guards.opSuperchain, guards.userOps ]);
export const accountsLabelSearch = factoryMultichain([ guards.opSuperchain, guards.accountsLabelSearch ]);
export const advancedFilter = factoryMultichain([ guards.opSuperchain, guards.advancedFilter ]);
export const csvExport = factoryMultichain([ guards.opSuperchain, guards.csvExport ]);
