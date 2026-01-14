import { InputBaseProps, TextField } from "@mui/material";
import {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";
import { formValidation } from "@/utilities";

interface InputProps {
  register: UseFormRegister<any>;
  name: string;
  label?: string;
  type: string;
  errors?: FieldErrors;
  inputProps?: InputBaseProps["inputProps"];
  disabled?: boolean;
  trigger?: UseFormTrigger<any>;
  clearErrors?: UseFormClearErrors<any>;
  watch: UseFormWatch<any>;
}

export const Input = ({
  register,
  name,
  label = "",
  type,
  errors,
  inputProps,
  disabled = false,
  trigger,
  clearErrors,
  watch,
}: InputProps) => {
  const value = watch(name);

  return (
    <>
      <TextField
        required={false}
        disabled={disabled}
        type={type}
        error={!!errors?.[name]}
        id={name}
        label={value ? "" : label || name}
        {...register(name)}
        {...(inputProps && { inputProps: inputProps })}
        onChange={(e) => {
          register(name).onChange(e);
          if (clearErrors) clearErrors(name);
          if (trigger) trigger(name);
        }}
        fullWidth
      />
      {errors && formValidation(errors, name)}
    </>
  );
};
