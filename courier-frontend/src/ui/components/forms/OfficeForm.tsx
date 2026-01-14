import { useEffect, useState } from "react";
import {
  FieldArrayWithId,
  FieldErrors,
  useFieldArray,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useForm,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

import { BranchBase, FormProps } from "@/models";
import { Input } from "../Input";
import { useFetch } from "@/hooks";
import { serviceRequest } from "@/services";
import { urlPaths } from "@/utilities";
import { resourceAdapter } from "@/adapters";
import { ControlledSelect } from "../ControlledSelect";

interface ManualBranchFormProps {
  fields: FieldArrayWithId<any, "branches", "id">[];
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
  remove: UseFieldArrayRemove;
  append: UseFieldArrayAppend<any, "branches">;
}

const validationSchema = yup.object({
  id: yup.mixed().nullable(),
  name: yup.string().required("Office name is required"),
  branches: yup
    .array()
    .of(
      yup.object({
        id: yup.mixed().nullable(),
        city: yup.string().required("City is required"),
        address: yup.string().required("Address is required"),
      }),
    )
    .nullable()
    .optional(),
});

export const OfficeForm = ({ id, onSubmit, onClose }: FormProps) => {
  const { callEndPoint } = useFetch();
  const [branches, setBranches] = useState<BranchBase[] | null>(null);
  const [manualAddEnabled, setManualAddEnabled] = useState<boolean>(false);

  const isEditMode = id !== null;

  const {
    register,
    control,
    handleSubmit,
    reset,
    clearErrors,
    trigger,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      id: null,
      name: "",
      branches: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "branches",
  });

  useEffect(() => {
    if (id) {
      const fetchOffice = async () => {
        const res = await callEndPoint(
          serviceRequest.getItem(`${urlPaths.office.base}/${id}`),
          resourceAdapter.officeAdapter,
        );
        if (!res.error && res.data) {
          reset(res.data);
          setBranches(res.data.branches);
        }
      };
      fetchOffice();
    }
  }, [id, reset]);

  const onSubmitForm = (data: any) => {
    const { id, branches, ...officeRest } = data;

    const cleanedBranches =
      Array.isArray(branches) && branches.length > 0
        ? branches.map((b: any) => {
            const { id, ...branchRest } = b;
            return b.id ? b : branchRest;
          })
        : undefined;

    const payload: any = {
      ...(id ? { id } : {}),
      ...officeRest,
      ...(cleanedBranches ? { branches: cleanedBranches } : {}),
    };

    console.log(payload);
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="row mb-3">
        <div className="col-12">
          <Input
            register={register}
            label="Office Name"
            name="name"
            type="text"
            errors={errors}
            watch={watch}
          />
        </div>
      </div>

      {!isEditMode && (
        <ManualBranchForm
          fields={fields}
          register={register}
          errors={errors}
          watch={watch}
          remove={remove}
          append={append}
        />
      )}

      {isEditMode && (
        <>
          {branches && branches.length > 0 && (
            <div className="row mb-3">
              <div className="col-12">
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
            </div>
          )}

          <div className="row mb-3">
            <div className="col-12">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={manualAddEnabled}
                    onChange={(e) => setManualAddEnabled(e.target.checked)}
                  />
                }
                label="Add new branches manually"
              />
            </div>
          </div>

          {manualAddEnabled && (
            <ManualBranchForm
              fields={fields}
              register={register}
              errors={errors}
              watch={watch}
              remove={remove}
              append={append}
            />
          )}
        </>
      )}

      {/* {!isEditMode && ( */}
      {/*   <div className="row mb-3"> */}
      {/*     <div className="col-12"> */}
      {/*       {fields.map((field, index) => ( */}
      {/*         <div key={field.id} className="mb-3"> */}
      {/*           <Divider textAlign="right"> */}
      {/*             <Tooltip title="Remove branch"> */}
      {/*               <IconButton size="small" onClick={() => remove(index)}> */}
      {/*                 <CloseIcon fontSize="small" /> */}
      {/*               </IconButton> */}
      {/*             </Tooltip> */}
      {/*           </Divider> */}
      {/**/}
      {/*           <div className="row mb-2"> */}
      {/*             <div className="col-12 col-md-6"> */}
      {/*               <Input */}
      {/*                 register={register} */}
      {/*                 label="City" */}
      {/*                 name={`branches.${index}.city`} */}
      {/*                 type="text" */}
      {/*                 errors={errors} */}
      {/*                 watch={watch} */}
      {/*               /> */}
      {/*             </div> */}
      {/*             <div className="col-12 col-md-6"> */}
      {/*               <Input */}
      {/*                 register={register} */}
      {/*                 label="Address" */}
      {/*                 name={`branches.${index}.address`} */}
      {/*                 type="text" */}
      {/*                 errors={errors} */}
      {/*                 watch={watch} */}
      {/*               /> */}
      {/*             </div> */}
      {/*           </div> */}
      {/*         </div> */}
      {/*       ))} */}
      {/*       <Divider textAlign="right"> */}
      {/*         <Tooltip title="Add branch"> */}
      {/*           <IconButton */}
      {/*             size="small" */}
      {/*             onClick={() => append({ city: "", address: "" })} */}
      {/*           > */}
      {/*             <AddIcon fontSize="small" /> */}
      {/*           </IconButton> */}
      {/*         </Tooltip> */}
      {/*       </Divider> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* )} */}
      {/**/}
      {/* {isEditMode && branches && branches.length > 0 && ( */}
      {/*   <div className="row mb-3"> */}
      {/*     <div className="col-12"> */}
      {/*       <ControlledSelect<BranchBase> */}
      {/*         name="branches" */}
      {/*         label="Branches" */}
      {/*         control={control} */}
      {/*         multiple */}
      {/*         options={branches.map((branch) => ({ */}
      {/*           value: branch, */}
      {/*           label: `${branch.city}\n${branch.address}`, */}
      {/*         }))} */}
      {/*         errors={errors} */}
      {/*         clearErrors={clearErrors} */}
      {/*         trigger={trigger} */}
      {/*       /> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* )} */}

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

const ManualBranchForm = ({
  fields,
  register,
  errors,
  watch,
  remove,
  append,
}: ManualBranchFormProps) => {
  return (
    <div className="row mb-3">
      <div className="col-12">
        {fields.map((field, index) => (
          <div key={field.id} className="mb-3">
            <Divider textAlign="right">
              <Tooltip title="Remove branch">
                <IconButton size="small" onClick={() => remove(index)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Divider>

            <div className="row mb-2">
              <div className="col-12 col-md-6">
                <Input
                  register={register}
                  label="City"
                  name={`branches.${index}.city`}
                  type="text"
                  errors={errors}
                  watch={watch}
                />
              </div>
              <div className="col-12 col-md-6">
                <Input
                  register={register}
                  label="Address"
                  name={`branches.${index}.address`}
                  type="text"
                  errors={errors}
                  watch={watch}
                />
              </div>
            </div>
          </div>
        ))}
        <Divider textAlign="right">
          <Tooltip title="Add branch">
            <IconButton
              size="small"
              onClick={() => append({ city: "", address: "" })}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Divider>
      </div>
    </div>
  );
};
