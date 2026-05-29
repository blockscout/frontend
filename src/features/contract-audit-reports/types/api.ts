// SPDX-License-Identifier: LicenseRef-Blockscout

export type SmartContractSecurityAudit = {
  audit_company_name: string;
  audit_publish_date: string;
  audit_report_url: string;
};

export type SmartContractSecurityAudits = {
  items: Array<SmartContractSecurityAudit>;
};

export type SmartContractSecurityAuditSubmission = {
  address_hash: string;
  submitter_name: string;
  submitter_email: string;
  is_project_owner: boolean;
  project_name: string;
  project_url: string;
  audit_company_name: string;
  audit_report_url: string;
  audit_publish_date: string;
  comment?: string;
};
