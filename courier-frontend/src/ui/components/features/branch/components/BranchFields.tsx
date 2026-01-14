import { useState } from "react";

import { resourceAdapter } from "@/adapters";
import { useAsync, useFetch } from "@/hooks";
import { OfficeBase } from "@/models";
import { serviceRequest } from "@/services";
import { ControlledSelect, Input } from "@/ui/components";
import { urlPaths } from "@/utilities";
import { BranchFieldsProps } from "./components.models";
import { OfficeCreateOptions } from "./OfficeCreateOptions";
import { OfficeUpdateOptions } from "./OfficeUpdateOptions";

export const BranchFields = ({
  id,
  register,
  watch,
  control,
  errors,
  trigger,
  clearErrors,
  setValue,
  isSearchMode = false,
}: BranchFieldsProps) => {
  const { callEndPoint } = useFetch();

  const [offices, setOffices] = useState<OfficeBase[] | null>(null);
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

  useAsync(
    async () =>
      await callEndPoint(
        serviceRequest.getItem(`${urlPaths.branch.base}/cities`),
      ),
    (response) => {
      if (!response.error && response.data) setCities(response.data);
    },
    () => {},
    [],
  );

  return (
    <>
      <div className="row mb-3">
        {!isSearchMode && (
          <div className="col-12 col-md-6">
            <Input
              register={register}
              label="City"
              name="city"
              type="text"
              errors={errors}
              watch={watch}
            />
          </div>
        )}
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
      {!isSearchMode && offices && offices.length > 0 && (
        <div className="row mb-3">
          <div className="col-12">
            {id ? (
              <OfficeUpdateOptions
                register={register}
                control={control}
                offices={offices}
                errors={errors}
                clearErrors={clearErrors}
                trigger={trigger}
                watch={watch}
                setValue={setValue}
              />
            ) : (
              <OfficeCreateOptions
                register={register}
                control={control}
                offices={offices}
                errors={errors}
                clearErrors={clearErrors}
                trigger={trigger}
                watch={watch}
                setValue={setValue}
              />
            )}
          </div>
        </div>
      )}
      {isSearchMode && cities && offices && (
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <ControlledSelect<OfficeBase>
              name="office"
              label="Select Office"
              control={control}
              multiple={isSearchMode}
              options={offices.map((o) => ({
                value: o,
                label: o.name,
              }))}
              errors={errors}
              clearErrors={clearErrors}
              trigger={trigger}
            />
          </div>
          <div className="col-12 col-md-6">
            <ControlledSelect
              name="cities"
              label="Select City"
              control={control}
              multiple={isSearchMode}
              options={cities.map((city, index) => ({
                value: { id: index, city },
                label: city,
              }))}
              errors={errors}
              clearErrors={clearErrors}
              trigger={trigger}
            />
          </div>
        </div>
      )}
    </>
  );
};
