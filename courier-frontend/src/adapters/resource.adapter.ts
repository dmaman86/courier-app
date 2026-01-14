import {
  Branch,
  BranchBase,
  Office,
  OfficeBase,
  Contact,
  ContactBase,
  Page,
  OfficePage,
  ContactSearchAdvanced,
  BranchSearchAdvanced,
} from "@/models";

export const resourceAdapter = (() => {
  const branchBaseAdapter = (data: any): BranchBase => ({
    ...(data.id && { id: data.id }),
    city: data.city,
    address: data.address,
  });

  const branchAdapter = (data: any): Branch => {
    return {
      ...branchBaseAdapter(data),
      office: officeAdapter(data.office),
    };
  };

  const officeBaseAdapter = (data: any): OfficeBase => ({
    ...(data.id && { id: data.id }),
    name: data.name,
  });

  const officePageAdapter = (data: any): OfficePage => {
    return {
      ...officeBaseAdapter(data),
      countBranches: data.countBranches,
      countContacts: data.countContacts,
    };
  };

  const officeAdapter = (data: any): Office => {
    return {
      ...officeBaseAdapter(data),
      ...(data.branches && {
        branches: data.branches.map(branchBaseAdapter),
      }),
    };
  };

  const dataToOfficeEntity = (data: any): OfficeBase | Office => ({
    ...(data.id && { id: data.id }),
    name: data.name,
    ...(data.branches && {
      branches: data.branches.map(branchBaseAdapter),
    }),
  });

  const contactBaseAdapter = (data: any): ContactBase => ({
    ...(data.id && { id: data.id }),
    fullName: data.fullName,
    phoneNumber: data.phoneNumber,
    office: officeBaseAdapter(data.office),
  });

  const contactAdapter = (data: any): Contact => {
    return {
      ...contactBaseAdapter(data),
      branches: data.branches.map(branchBaseAdapter),
    };
  };

  const branchAdvancedAdapter = (data: any): BranchSearchAdvanced => ({
    address: data?.address.trim() || undefined,
    offices: Array.isArray(data?.offices)
      ? data.offices.map(officeBaseAdapter)
      : [],
    cities: Array.isArray(data?.cities)
      ? data.cities.map((c: { city: string }) => c.city)
      : [],
  });

  const contactAdvancedAdapter = (data: any): ContactSearchAdvanced => ({
    fullName: data?.fullName.trim() || undefined,
    phoneNumber: data?.phoneNumber.trim() || undefined,
    offices: Array.isArray(data?.office)
      ? data.office.map(officeBaseAdapter)
      : [],
    branches: Array.isArray(data?.branches)
      ? data.branches.map(branchBaseAdapter)
      : [],
    cities: Array.isArray(data?.cities)
      ? data.cities.map((c: { city: string }) => c.city)
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

  return {
    branchBaseAdapter,
    branchAdapter,
    branchAdvancedAdapter,
    officeBaseAdapter,
    officePageAdapter,
    officeAdapter,
    dataToOfficeEntity,
    contactBaseAdapter,
    contactAdapter,
    contactAdvancedAdapter,
    listAdapter,
  };
})();
