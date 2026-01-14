import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAsync, useDebounce, useFetch } from "@/hooks";
import { AdvancedSearchProps, Role } from "@/models";
import { serviceRequest } from "@/services";
import { urlPaths } from "@/utilities";
import { userAdapter } from "@/adapters";
import { UserFields } from "@/ui/components";

const dynamicSchema = yup.object({
  fullName: yup.string(),
  email: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .notRequired()
    .email("Invalid email format"),
  phoneNumber: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .notRequired()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  roles: yup
    .array()
    .of(
      yup.object({
        id: yup.mixed(),
        name: yup.string().required(),
      }),
    )
    .nullable()
    .notRequired(),

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

  address: yup.string().nullable().notRequired(),
});

export const UserSearchContent = ({
  onChange,
  isOpen,
}: AdvancedSearchProps) => {
  const { callEndPoint } = useFetch();

  const [roles, setRoles] = useState<Role[] | null>(null);

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
      fullName: "",
      email: "",
      phoneNumber: "",
      roles: [],
      office: [],
      branches: [],
      address: "",
    },
  });

  const fullName = useDebounce(watch("fullName"), 500);
  const email = useDebounce(watch("email"), 500);
  const phoneNumber = useDebounce(watch("phoneNumber"), 500);
  const address = useDebounce(watch("address"), 500);

  const selectedRoles = watch("roles");
  const office = watch("office");
  const branches = watch("branches");

  useAsync(
    async () =>
      await callEndPoint(
        serviceRequest.getItem(urlPaths.role.getList),
        (data) => userAdapter.listAdapter(data, userAdapter.roleAdapter),
      ),
    (response) => {
      if (!response.error && response.data) {
        setRoles(response.data);
      }
    },
    () => {},
    [],
  );

  useEffect(() => {
    onChange({
      fullName,
      email,
      phoneNumber,
      selectedRoles,
      office,
      branches,
      address,
    });
  }, [fullName, email, phoneNumber, selectedRoles, office, branches, address]);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  return (
    <form>
      <UserFields
        register={register}
        watch={watch}
        control={control}
        errors={errors}
        trigger={trigger}
        clearErrors={clearErrors}
        setValue={setValue}
        roles={roles}
        isSearchMode={true}
      />
    </form>
  );
};
