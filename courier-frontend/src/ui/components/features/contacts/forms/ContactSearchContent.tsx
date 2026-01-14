import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdvancedSearchProps } from "@/models";
import { useDebounce } from "@/hooks";
import { ContactFields } from "../components/ContactFields";

const schema = yup.object({
  fullName: yup.string(),

  phoneNumber: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .notRequired()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),

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

  branches: yup
    .array()
    .of(
      yup.object({
        id: yup.mixed().nullable(),
        city: yup.string().required(),
        address: yup.string().required(),
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

export const ContactSearchContent = ({
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
    resolver: yupResolver(schema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      office: [],
      branches: [],
      cities: [],
      address: "",
    },
  });

  const fullName = useDebounce(watch("fullName"), 500);
  const phoneNumber = useDebounce(watch("phoneNumber"), 500);
  const address = useDebounce(watch("address"), 500);

  const office = watch("office");
  const branches = watch("branches");
  const cities = watch("cities");

  useEffect(() => {
    onChange({ fullName, phoneNumber, office, branches, cities, address });
  }, [fullName, phoneNumber, office, branches, cities, address]);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  return (
    <form>
      <ContactFields
        register={register}
        errors={errors}
        trigger={trigger}
        clearErrors={clearErrors}
        control={control}
        watch={watch}
        setValue={setValue}
        isSearchMode={true}
      />
    </form>
  );
};
