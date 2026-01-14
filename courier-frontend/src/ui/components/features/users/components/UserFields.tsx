import { useEffect, useState } from "react";
import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";

import { BranchBase, OfficeBase, Role, ROLES } from "@/models";
import { Input, ControlledSelect } from "@/ui/components";

import { useAsync, useFetch } from "@/hooks";
import { serviceRequest } from "@/services";
import { urlPaths } from "@/utilities";
import { resourceAdapter } from "@/adapters";

interface UserFieldsProps {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  control: Control<any>;
  errors: FieldErrors<any>;
  trigger: UseFormTrigger<any>;
  clearErrors: UseFormClearErrors<any>;
  setValue: UseFormSetValue<any>;
  roles: Role[] | null;
  allowRoles?: boolean;
  isSearchMode?: boolean;
}

export const UserFields = ({
  register,
  watch,
  control,
  errors,
  trigger,
  clearErrors,
  setValue,
  roles,
  allowRoles = false,
  isSearchMode = false,
}: UserFieldsProps) => {
  const [offices, setOffices] = useState<OfficeBase[] | null>(null);

  const [branches, setBranches] = useState<BranchBase[] | null>(null);

  const { callEndPoint } = useFetch();

  const selectedRoles = watch("roles");
  const selectedOffice = watch("office");

  const isClient =
    selectedRoles &&
    selectedRoles.some((role: Role) => role.name === ROLES.CLIENT);

  useAsync(
    async () => {
      if (isClient || isSearchMode) {
        return await callEndPoint(
          serviceRequest.getItem(urlPaths.office.getList),
          (data) =>
            resourceAdapter.listAdapter(
              data,
              resourceAdapter.officeBaseAdapter,
            ),
        );
      }
      return { data: null, error: null };
    },
    (response) => {
      if (!response.error) setOffices(response.data);
    },
    () => {},
    [isClient, isSearchMode],
  );

  const fetchBranchesByOfficeId = async (id: string | number) => {
    const res = await callEndPoint(
      serviceRequest.getItem(`${urlPaths.branch.getByOffice}/${id}`),
      (data) =>
        resourceAdapter.listAdapter(data, resourceAdapter.branchBaseAdapter),
    );
    if (!res.error && res.data) setBranches(res.data);
  };

  const fetchAllBranches = async () => {
    const res = await callEndPoint(
      serviceRequest.getItem(urlPaths.branch.getList),
      (data) =>
        resourceAdapter.listAdapter(data, resourceAdapter.branchBaseAdapter),
    );
    if (!res.error && res.data) setBranches(res.data);
  };

  useEffect(() => {
    if (!isSearchMode && selectedOffice && selectedOffice.id) {
      fetchBranchesByOfficeId(selectedOffice.id);
    } else if (isSearchMode && !branches) {
      fetchAllBranches();
    } else {
      setBranches([]);
      setValue("branches", []);
    }
  }, [selectedOffice?.id, setValue, isSearchMode]);

  useEffect(() => {
    if (!isClient && !isSearchMode) {
      setValue("office", undefined);
      setValue("branches", []);
    }
  }, [isClient, setValue, isSearchMode]);

  return (
    <>
      <div className="row mb-3">
        <div className="col-12 col-md-4 mb-3">
          <Input
            register={register}
            label="Full Name"
            name="fullName"
            type="text"
            errors={errors}
            watch={watch}
          />
        </div>
        <div className="col-12 col-md-4 mb-3">
          <Input
            register={register}
            label="Email"
            name="email"
            type="email"
            errors={errors}
            watch={watch}
          />
        </div>
        <div className="col-12 col-md-4">
          <Input
            register={register}
            label="Phone Number"
            name="phoneNumber"
            type="text"
            errors={errors}
            watch={watch}
          />
        </div>
      </div>
      <div className="row mb-3 align-items-start">
        <div className="col-12 col-md-4 mb-3">
          {roles && (
            <ControlledSelect<Role>
              name="roles"
              label="Roles"
              control={control}
              multiple
              options={roles.map((role) => ({
                value: role,
                label: role.name.replace(/^ROLE_/, ""),
              }))}
              errors={errors}
              clearErrors={clearErrors}
              trigger={trigger}
              disabled={allowRoles}
            />
          )}
        </div>
        <div className="col-12 col-md-4 mb-3">
          {(isClient || isSearchMode) && offices && (
            <ControlledSelect<OfficeBase>
              name="office"
              label="Office"
              control={control}
              multiple={isSearchMode}
              options={offices.map((office) => ({
                value: office,
                label: office.name,
              }))}
              errors={errors}
              clearErrors={clearErrors}
              trigger={trigger}
            />
          )}
        </div>

        <div className="col-12 col-md-4">
          {(isClient || isSearchMode) && branches && (
            <ControlledSelect<BranchBase>
              name="branches"
              label="Branches"
              control={control}
              multiple
              options={branches.map((branch) => ({
                value: branch,
                label: `${branch.city}\n${branch.address}`,
              }))}
              errors={errors}
              clearErrors={clearErrors}
              trigger={trigger}
            />
          )}
        </div>
      </div>
      {isSearchMode && (
        <div className="row mb-3 align-items-center">
          <div className="col-12">
            <Input
              register={register}
              label="Address"
              name="address"
              type="text"
              errors={errors}
              watch={watch}
            />
          </div>
        </div>
      )}
    </>
  );
};
