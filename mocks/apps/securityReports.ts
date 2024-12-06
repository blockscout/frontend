import { apps } from './apps';

export const securityReports = [
  {
    appName: apps[0].id,
    doc: 'http://docs.li.fi/smart-contracts/deployments#mainnet',
    chainsData: {
      '1': {
        overallInfo: {
          verifiedNumber: 1,
          totalContractsNumber: 1,
          solidityScanContractsNumber: 1,
          securityScore: 87.5,
          issueSeverityDistribution: {
            critical: 4,
            gas: 1,
            high: 0,
            informational: 4,
            low: 2,
            medium: 0,
          },
        },
        contractsData: [
          {
            address: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
            isVerified: true,
            solidityScanReport: {
              connection_id: '',
              contract_address: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
              contract_chain: 'optimism',
              contract_platform: 'blockscout',
              contract_url: 'http://optimism.blockscout.com/address/0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
              contractname: 'LiFiDiamond',
              is_quick_scan: true,
              node_reference_id: null,
              request_type: 'threat_scan',
              scanner_reference_url: 'http://solidityscan.com/quickscan/0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE/blockscout/eth?ref=blockscout',
              scan_status: 'scan_done',
              scan_summary: {
                issue_severity_distribution: {
                  critical: 0,
                  gas: 1,
                  high: 0,
                  informational: 4,
                  low: 2,
                  medium: 0,
                },
                lines_analyzed_count: 72,
                scan_time_taken: 1,
                score: '4.38',
                score_v2: '87.50',
                threat_score: '100.00',
              },
            },
          },
        ],
      },
    },
  },
];
