import { Role } from "./user.models";

export interface BaseEntity {
  id?: number | string;
}

export interface AuthState extends BaseEntity {
  email: string | null;
  fullName: string | null;
  phoneNumber: string | null;
  roles: Role[] | [];
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: { empty: boolean; unsorted: boolean; sorted: boolean };
    unpaged: boolean;
  };
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
}
