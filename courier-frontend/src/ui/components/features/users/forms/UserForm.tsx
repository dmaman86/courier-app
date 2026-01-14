import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { userAdapter } from "@/adapters";
import { useAsync, useFetch, useAuth } from "@/hooks";
import { FormProps, Role, ROLES } from "@/models";
import { serviceRequest } from "@/services";
import { urlPaths } from "@/utilities";
import { UserFields } from "@/ui/components";
import { Button, Stack } from "@mui/material";

const dynamicSchema = yup.object({
  id: yup.mixed().nullable(),
  fullName: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),

  roles: yup
    .array()
    .of(
      yup.object({
        id: yup.mixed(),
        name: yup.string().required(),
      }),
    )
    .min(1, "At least one role is required"),

  // Dynamic part using lazy
  office: yup.lazy((_, { parent }) => {
    const isClient = parent.roles?.some(
      (role: any) => role.name === ROLES.CLIENT,
    );
    return isClient
      ? yup
          .object({
            id: yup.mixed().nullable(),
            name: yup.string().required(),
          })
          .nullable()
          .required("Office is required")
      : yup.mixed().notRequired();
  }),

  branches: yup.lazy((_, { parent }) => {
    const isClient = parent.roles?.some(
      (role: any) => role.name === ROLES.CLIENT,
    );
    const hasOffice = !!parent.office?.id;
    return isClient && hasOffice
      ? yup
          .array()
          .of(
            yup.object({
              id: yup.mixed().nullable(),
              city: yup.string().required(),
              address: yup.string().required(),
            }),
          )
          .min(1, "At least one branch is required")
      : yup.mixed().notRequired();
  }),
});

export const UserForm = ({ id, onSubmit, onClose }: FormProps) => {
  const { callEndPoint } = useFetch();
  const { auth } = useAuth();

  const [roles, setRoles] = useState<Role[] | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    clearErrors,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(dynamicSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      id: null,
      fullName: "",
      email: "",
      phoneNumber: "",
      roles: [],
      office: undefined,
      branches: [],
    },
  });

  const [disabled, setDisabled] = useState<boolean>(false);

  useAsync(
    async () => {
      if (id) {
        return await callEndPoint(
          serviceRequest.getItem(`${urlPaths.user.base}/${id}`),
          userAdapter.userFormDtoAdapter,
        );
      }
      return { data: null, error: null };
    },
    (response) => {
      if (!response.error && response.data) {
        reset(response.data);
      }
    },
    () => {},
    [id],
  );

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
    if (auth && auth.id && id) {
      setDisabled(id === auth.id);
    }
  }, [auth, id]);

  const onSubmitForm = (data: any) => {
    // const user = userAdapter.userFormDtoToEntity(data);
    console.log("Submitting...");
    console.log(data);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <UserFields
        register={register}
        watch={watch}
        control={control}
        errors={errors}
        trigger={trigger}
        clearErrors={clearErrors}
        setValue={setValue}
        roles={roles}
        allowRoles={disabled}
      />
      <div className="col pt-3 text-center">
        <Stack spacing={2} direction="row" justifyContent="right">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!isValid}
          >
            Submit
          </Button>
          {onClose && (
            <Button type="button" color="secondary" onClick={onClose}>
              Cancel
            </Button>
          )}
        </Stack>
      </div>
    </form>
  );
};
