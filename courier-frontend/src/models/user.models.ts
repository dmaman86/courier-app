import { BaseEntity } from "./base.models";
import { BranchBase, OfficeBase } from "./resource.models";

export interface Role extends BaseEntity {
  name: string;
}

export interface User extends BaseEntity {
  fullName: string;
  email: string;
  phoneNumber: string;
  roles: Role[];
}

export interface Client extends User {
  office: OfficeBase;
  branches: BranchBase[];
}

export interface ContactFormDto extends BaseEntity {
  fullName: string;
  phoneNumber: string;
  office: OfficeBase | null;
  branches: BranchBase[] | null;
}

export interface UserFormDto {
  id: number | string | null;
  fullName: string;
  email: string;
  phoneNumber: string;
  roles: Role[];
  office?: OfficeBase;
  branches?: BranchBase[];
}

export interface UserAdvancedSearch {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  roles?: Role[];
  offices?: OfficeBase[];
  branches?: BranchBase[];
  address?: string;
}
