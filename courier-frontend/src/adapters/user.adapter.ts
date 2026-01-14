import {
  Client,
  Role,
  User,
  AuthState,
  Page,
  UserFormDto,
  UserAdvancedSearch,
} from "@/models";
import { resourceAdapter } from "./resource.adapter";

export const userAdapter = (() => {
  const roleAdapter = (data: any): Role => ({
    ...(data.id && { id: data.id }),
    name: data.name,
  });

  const userAdapter = (data: any): User => ({
    ...(data.id && { id: data.id }),
    fullName: data.fullName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    roles: data.roles.map(roleAdapter),
  });

  const authStateAdapter = (data: any): AuthState => {
    return {
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      roles: data.roles.map(roleAdapter),
    };
  };

  const clientAdapter = (data: any): Client => {
    return {
      ...userAdapter(data),
      office: resourceAdapter.officeBaseAdapter(data.office),
      branches: data.branches.map(resourceAdapter.branchBaseAdapter),
    };
  };

  const userFormDtoAdapter = (data: any): UserFormDto => {
    return {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      roles: data.roles.map(roleAdapter),
      ...(isClient(data) && {
        office: resourceAdapter.officeBaseAdapter(data.office),
        branches: data.branches.map(resourceAdapter.branchBaseAdapter),
      }),
    };
  };

  const userFormDtoToEntity = (data: any): User | Client => ({
    ...(data.id && { id: data.id }),
    fullName: data.fullName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    roles: data.roles,
    ...(isClient(data) && {
      office: resourceAdapter.officeBaseAdapter(data.office),
      branches: data.branches.map(resourceAdapter.branchBaseAdapter),
    }),
  });

  const userAdvancesSearchAdapter = (data: any): UserAdvancedSearch => ({
    fullName: data?.fullName.trim() || undefined,
    email: data?.email.trim() || undefined,
    phoneNumber: data?.phoneNumber.trim() || undefined,
    roles: Array.isArray(data?.selectedRoles)
      ? data.selectedRoles.map(roleAdapter)
      : [],
    offices: Array.isArray(data?.office)
      ? data.office.map(resourceAdapter.officeBaseAdapter)
      : [],
    branches: Array.isArray(data?.branches)
      ? data.branches.map(resourceAdapter.branchBaseAdapter)
      : [],
    address: data?.address.trim() || undefined,
  });

  const listAdapter = <T>(
    data: any,
    adapter: (item: any) => T,
  ): T[] | Page<T> => {
    if (data.content && Array.isArray(data.content)) {
      return {
        ...data,
        content: data.content.map(adapter),
      };
    }
    return Array.isArray(data) ? data.map(adapter) : [];
  };

  const isClient = (data: any): boolean => {
    return data?.office !== undefined && data?.branches !== undefined;
  };

  return {
    roleAdapter,
    userAdapter,
    authStateAdapter,
    clientAdapter,
    userFormDtoAdapter,
    userFormDtoToEntity,
    userAdvancesSearchAdapter,
    listAdapter,
  };
})();
