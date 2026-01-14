import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Stack } from "@mui/material";

import { useFetch } from "@/hooks";
import { FormProps, OfficeBase } from "@/models";
import { urlPaths } from "@/utilities";
import { serviceRequest } from "@/services";
import { resourceAdapter } from "@/adapters";
import { Input, ControlledSelect } from "@/ui/components";
import { BranchFields } from "../components/BranchFields";

const validationSchema = yup.object({
  id: yup.mixed().nullable(),
  city: yup.string().required("This field is required"),
  address: yup.string().required("This field is required"),
  office: yup
    .object({
      id: yup.mixed().nullable(),
      name: yup.string().required("Office name is required"),
    })
    .required("This field is required"),
});

export const BranchForm = ({ id, onSubmit, onClose }: FormProps) => {
  const { callEndPoint } = useFetch();

  const {
    register,
    control,
    handleSubmit,
    reset,
    clearErrors,
    trigger,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      id: null,
      city: "",
      address: "",
      office: { id: undefined, name: "" },
    },
  });

  useEffect(() => {
    if (id) {
      const fetchBranch = async () => {
        const res = await callEndPoint(
          serviceRequest.getItem(`${urlPaths.branch.base}/${id}`),
          resourceAdapter.branchAdapter,
        );
        if (!res.error && res.data) {
          reset(res.data);
        }
      };
      fetchBranch();
    }
  }, [id, reset]);

  const onSubmitForm = (data: any) => {
    console.log(data);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <BranchFields
        id={id}
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
