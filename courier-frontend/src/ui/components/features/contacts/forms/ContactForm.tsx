import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Stack } from "@mui/material";

import { BranchBase, FormProps, OfficeBase } from "@/models";
import { useAsync, useFetch } from "@/hooks";
import { serviceRequest } from "@/services";
import { urlPaths } from "@/utilities";
import { resourceAdapter } from "@/adapters";
import { Input, ControlledSelect } from "@/ui/components";
import { ContactFields } from "../components/ContactFields";

const contactSchema = yup.object({
  id: yup.mixed().nullable(),

  fullName: yup.string().required("Full name is required"),

  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),

  office: yup
    .object({
      id: yup.mixed().nullable(),
      name: yup.string().required(),
    })
    .nullable()
    .required("Office is required"),

  branches: yup
    .array()
    .of(
      yup.object({
        id: yup.mixed().nullable(),
        city: yup.string().required(),
        address: yup.string().required(),
      }),
    )
    .min(1, "At least one branch is required"),
});

export const ContactForm = ({ id, onSubmit, onClose }: FormProps) => {
  const { callEndPoint } = useFetch();

  const [offices, setOffices] = useState<OfficeBase[] | null>(null);

  const [branches, setBranches] = useState<BranchBase[] | null>(null);

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
    resolver: yupResolver(contactSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      id: null,
      fullName: "",
      phoneNumber: "",
      office: undefined,
      branches: [],
    },
  });

  // const selectedOffice = watch("office");

  useAsync(
    async () => {
      if (id) {
        return await callEndPoint(
          serviceRequest.getItem(`${urlPaths.contact.base}/${id}`),
          resourceAdapter.contactAdapter,
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

  /*useAsync(
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

  useEffect(() => {
    if (selectedOffice?.id) {
      const fetchBranches = async () => {
        const res = await callEndPoint(
          serviceRequest.getItem(
            `${urlPaths.branch.getByOffice}/${selectedOffice.id}`,
          ),
          (data) =>
            resourceAdapter.listAdapter(
              data,
              resourceAdapter.branchBaseAdapter,
            ),
        );
        if (!res.error && res.data) setBranches(res.data);
      };
      fetchBranches();
    } else {
      setBranches([]);
      setValue("branches", []);
    }
  }, [selectedOffice?.id, setValue]);*/

  const onSubmitForm = (data: any) => {
    console.log(data);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <ContactFields
        register={register}
        watch={watch}
        control={control}
        errors={errors}
        trigger={trigger}
        clearErrors={clearErrors}
        setValue={setValue}
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
