import { BaseEntity } from "@/models";
import { formValidation } from "@/utilities";
import {
  Controller,
  FieldErrors,
  UseFormClearErrors,
  UseFormTrigger,
} from "react-hook-form";
import Select from "react-select";

interface Option<T extends BaseEntity> {
  value: T;
  label: string;
}

interface ControlledSelectProps<T extends BaseEntity> {
  name: string;
  label: string;
  control: any;
  options: Option<T>[];
  multiple?: boolean;
  disabled?: boolean;
  errors?: FieldErrors;
  clearErrors?: UseFormClearErrors<any>;
  trigger?: UseFormTrigger<any>;
}

export const ControlledSelect = <T extends BaseEntity>({
  name,
  label,
  control,
  options,
  multiple = false,
  disabled = false,
  errors,
  clearErrors,
  trigger,
}: ControlledSelectProps<T>) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const currentValue = multiple
            ? options.filter((opt) =>
                (field.value as T[]).some((v) => v.id === opt.value.id),
              )
            : options.find((opt) => opt.value.id === (field.value as T)?.id) ||
              null;

          return (
            <Select
              options={options}
              isMulti={multiple}
              placeholder={`Select ${label}`}
              value={currentValue}
              onChange={(val) => {
                const parsedValue = multiple
                  ? (val as Option<T>[]).map((opt) => opt.value)
                  : (val as Option<T>)?.value;

                field.onChange(parsedValue);
                if (clearErrors) clearErrors(name);
                if (trigger) trigger(name);
              }}
              getOptionValue={(option) => option.value.id!.toString()}
              getOptionLabel={(option) => option.label}
              isDisabled={disabled}
            />
          );
        }}
      />
      {errors && formValidation(errors, name)}
    </>
  );
};
