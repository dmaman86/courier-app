import { BaseEntity } from "./base.models";

export interface OfficeBase extends BaseEntity {
  name: string;
}

export interface OfficePage extends OfficeBase {
  countBranches: number;
  countContacts: number;
}

export interface BranchBase extends BaseEntity {
  city: string;
  address: string;
}

export interface Branch extends BranchBase {
  office: OfficeBase;
}

export interface Office extends OfficeBase {
  branches: BranchBase[];
}

export interface ContactBase extends BaseEntity {
  fullName: string;
  phoneNumber: string;
  office: OfficeBase;
}

export interface Contact extends ContactBase {
  branches: BranchBase[];
}

export interface ContactSearchAdvanced {
  fullName?: string;
  phoneNumber?: string;
  offices?: OfficeBase[];
  branches?: BranchBase[];
  cities?: string[];
  address?: string;
}

export interface BranchSearchAdvanced {
  address?: string;
  cities?: string[];
  offices?: OfficeBase[];
}
