import { useEffect, useRef } from "react";

import { Controller } from "react-hook-form";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { OfficeOptionsProps } from "./components.models";
import { ControlledSelect, Input } from "@/ui/components";
import { OfficeBase } from "@/models";

export const OfficeUpdateOptions = ({
  register,
  control,
  offices,
  errors,
  clearErrors,
  trigger,
  watch,
  setValue,
}: OfficeOptionsProps) => {
  const officeOption = watch("officeOption") ?? "selectExisting";
  const selectedOffice = watch("office");

  const previousSelectedOfficeRef = useRef<OfficeBase | null>(null);

  useEffect(() => {
    if (officeOption === "newOffice") {
      if (selectedOffice?.id) {
        previousSelectedOfficeRef.current = {
          id: selectedOffice.id,
          name: selectedOffice.name,
        };
      }
      setValue("office", { id: null, name: "" });
    }
    if (
      officeOption !== "newOffice" &&
      selectedOffice?.id === null &&
      previousSelectedOfficeRef.current
    ) {
      setValue("office", previousSelectedOfficeRef.current);
    }
  }, [officeOption]);

  return (
    <>
      <div className="space-y-4">
        <Controller
          name="officeOption"
          control={control}
          render={({ field }) => (
            <RadioGroup
              {...field}
              value={field.value ?? "selectExisting"}
              row
              sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 2 }}
            >
              <FormControlLabel
                value="selectExisting"
                control={<Radio />}
                label="Link to existing office"
              />
              <FormControlLabel
                value="renameCurrent"
                control={<Radio />}
                label="Change current office name"
              />
              <FormControlLabel
                value="newOffice"
                control={<Radio />}
                label="Create and link new office"
              />
            </RadioGroup>
          )}
        />

        {officeOption === "selectExisting" && (
          <ControlledSelect<OfficeBase>
            name="office"
            label="Select Office"
            control={control}
            options={offices.map((o) => ({
              value: o,
              label: o.name,
            }))}
            errors={errors}
            clearErrors={clearErrors}
            trigger={trigger}
          />
        )}

        {officeOption === "renameCurrent" && (
          <Input
            register={register}
            label="Rename Current Office"
            name="office.name"
            type="text"
            errors={errors}
            watch={watch}
          />
        )}

        {officeOption === "newOffice" && (
          <Input
            register={register}
            label="New Office Name"
            name="office.name"
            type="text"
            errors={errors}
            watch={watch}
          />
        )}
      </div>
    </>
  );
};
