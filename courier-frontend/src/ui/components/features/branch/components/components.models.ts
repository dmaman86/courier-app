import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";

export interface BranchFieldsProps {
  id: string | number | null;
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  control: Control<any>;
  errors: FieldErrors<any>;
  trigger: UseFormTrigger<any>;
  clearErrors: UseFormClearErrors<any>;
  setValue: UseFormSetValue<any>;
  isSearchMode?: boolean;
}

export interface OfficeOptionsProps {
  register: UseFormRegister<any>;
  control: Control<any>;
  offices: OfficeBase[];
  errors: FieldErrors<any>;
  clearErrors: UseFormClearErrors<any>;
  trigger: UseFormTrigger<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}
