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

import { useAsync, useFetch } from "@/hooks";
import { BranchBase, FetchResponse, OfficeBase } from "@/models";
import { Input, ControlledSelect } from "@/ui/components";
import { serviceRequest } from "@/services";
import { urlPaths } from "@/utilities";
import { resourceAdapter } from "@/adapters";

interface ContactFieldsProps {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  control: Control<any>;
  errors: FieldErrors<any>;
  trigger: UseFormTrigger<any>;
  clearErrors: UseFormClearErrors<any>;
  setValue: UseFormSetValue<any>;
  isSearchMode?: boolean;
}

export const ContactFields = ({
  register,
  watch,
  control,
  errors,
  trigger,
  clearErrors,
  setValue,
  isSearchMode = false,
}: ContactFieldsProps) => {
  const { callEndPoint } = useFetch();

  const [offices, setOffices] = useState<OfficeBase[] | null>(null);

  const [branches, setBranches] = useState<BranchBase[] | null>(null);

  const [url, setUrl] = useState<string>("");

  const [cities, setCities] = useState<string[] | null>(null);

  const selectedOffice = watch("office");

  useAsync(
    async () =>
      await callEndPoint(
        serviceRequest.getItem(urlPaths.office.getList),
        (data) =>
          resourceAdapter.listAdapter(data, resourceAdapter.officeBaseAdapter),
      ),
    (response) => {
      if (!response.error && response.data) setOffices(response.data);
    },
    () => {},
    [],
  );

  const fetchBranches = async (url: string) => {
    return await callEndPoint(serviceRequest.getItem(url), (data) =>
      resourceAdapter.listAdapter(data, resourceAdapter.branchBaseAdapter),
    );
  };

  useEffect(() => {
    if (selectedOffice && selectedOffice.id) {
      setUrl(`${urlPaths.branch.getByOffice}/${selectedOffice.id}`);
    } else if (isSearchMode) {
      setUrl(urlPaths.branch.getList);
    }
  }, [selectedOffice, isSearchMode]);

  useAsync(
    async () => {
      if (url === "") return { data: null, error: null };
      return await fetchBranches(url);
    },
    (response) => {
      if (!response.error && response.data) {
        setBranches(response.data);
      } else {
        setBranches([]);
        setValue("branches", []);
      }
    },
    () => {},
    [url],
  );

  const fetchCities = async () => {
    const res = await callEndPoint(
      serviceRequest.getItem(`${urlPaths.branch.base}/cities`),
    );
    if (!res.error && res.data) {
      setCities(res.data);
    }
  };

  useEffect(() => {
    if (isSearchMode && !cities) {
      fetchCities();
    }
  }, [isSearchMode, cities]);

  return (
    <>
      <div className="row mb-3">
        <div className="col-12 col-md-6">
          <Input
            register={register}
            label="Full Name"
            name="fullName"
            type="text"
            errors={errors}
            watch={watch}
          />
        </div>
        <div className="col-12 col-md-6">
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
      <div className="row mb-3">
        {offices && (
          <div className="col-12 col-md-6">
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
          </div>
        )}

        {branches && (
          <div className="col-12 col-md-6">
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
          </div>
        )}
      </div>
      {isSearchMode && (
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <ControlledSelect
              name="cities"
              label="City"
              control={control}
              multiple
              options={(cities ?? []).map((city, index) => ({
                value: { id: index, city: city },
                label: city,
              }))}
              errors={errors}
              clearErrors={clearErrors}
              trigger={trigger}
            />
          </div>
          <div className="col-12 col-md-6">
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
