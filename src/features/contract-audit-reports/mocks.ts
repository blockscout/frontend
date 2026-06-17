import type { merged } from '@blockscout/api-types';

export const contractAudits:
merged.paths['/v2/smart-contracts/{address_hash_param}/audit-reports']['get']['responses']['200']['content']['application/json'] = {
  items: [
    {
      audit_company_name: 'OpenZeppelin',
      audit_publish_date: '2023-03-01',
      audit_report_url: 'https://blog.openzeppelin.com/eip-4337-ethereum-account-abstraction-incremental-audit',
    },
    {
      audit_company_name: 'OpenZeppelin',
      audit_publish_date: '2023-03-01',
      audit_report_url: 'https://blog.openzeppelin.com/eip-4337-ethereum-account-abstraction-incremental-audit',
    },
  ],
  next_page_params: null,
};
