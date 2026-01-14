import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdvancedSearchProps } from "@/models";
import { useDebounce, useFetch } from "@/hooks";
import { BranchFields } from "../components/BranchFields";

const dynamicSchema = yup.object({
  office: yup
    .array()
    .of(
      yup.object({
        id: yup.mixed(),
        name: yup.string().required(),
      }),
    )
    .nullable()
    .notRequired(),

  cities: yup
    .array()
    .of(
      yup.object({
        city: yup.string().required(),
      }),
    )
    .nullable()
    .notRequired(),

  address: yup.string().nullable().notRequired(),
});

export const BranchSearchContent = ({
  onChange,
  isOpen,
}: AdvancedSearchProps) => {
  const {
    register,
    trigger,
    clearErrors,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(dynamicSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      office: [],
      cities: [],
      address: "",
    },
  });

  const address = useDebounce(watch("address"), 500);

  const offices = watch("office");
  const cities = watch("cities");

  useEffect(() => {
    onChange({ address, offices, cities });
  }, [address, offices, cities]);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  return (
    <form>
      <BranchFields
        id={null}
        register={register}
        errors={errors}
        control={control}
        clearErrors={clearErrors}
        trigger={trigger}
        watch={watch}
        setValue={setValue}
        isSearchMode={true}
      />
    </form>
  );
};
