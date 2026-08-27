export interface AmbassadorRecord {
  id: string;
  code: string;
  name: string;
  phone: string;
  child: string;
  klass: string;
  consent: boolean;
  createdAt: number;
  demo?: boolean;
  existing?: boolean;
}

export interface LeadRecord {
  id: string;
  parent: string;
  phone: string;
  child: string;
  klass: string;
  code: string;
  consent?: boolean;
  status: string;
  createdAt: number;
  demo?: boolean;
}

export interface AmbassadorStats {
  opens: number;
  registrations: number;
  enrollments: number;
}

export declare const LEAD_STATUSES: string[];

export declare function generateCode(): string;
export declare function normalizePhone(phone: string): string;

export declare function createAmbassador(input: {
  name: string;
  phone: string;
  child: string;
  klass: string;
  consent: boolean;
}): Promise<AmbassadorRecord>;

export declare function logClick(code: string, path: string): Promise<number>;

export declare function createLead(input: {
  parent: string;
  phone: string;
  child: string;
  klass: string;
  code: string;
  consent: boolean;
}): Promise<{ lead: LeadRecord; duplicate: boolean }>;

export declare function getStats(code: string): Promise<AmbassadorStats>;

export declare function getAllLeads(): Promise<LeadRecord[]>;
export declare function getAllAmbassadors(): Promise<AmbassadorRecord[]>;
export declare function updateLeadStatus(id: string, status: string): Promise<LeadRecord>;
