import { validatorForm } from "@/helpers";
import { useForm } from "@/hooks";
import { FormState } from "@/domain";


export const useUpdatePasswordForm = () => {

    const initialState: FormState = {
        newPassword: {
            value: '',
            validation: [
                validatorForm.validateNotEmpty,
                validatorForm.validateMinLength
            ],
            validateRealTime: true
        },
        confirmPassword: {
            value: '',
            validation: [
                validatorForm.validateNotEmpty,
                validatorForm.validateMinLength,
                {
                    isValid: (value: string, formData?: FormState): boolean => value === formData?.newPassword.value,
                    message: 'Passwords must be equal'
                }
            ],
            validateRealTime: true
        }
    };

    const { values, handleChange, onFocus, validateForm } = useForm(initialState);

    const handleSubmit = () => {
        const isValidForm = validateForm();
        if(isValidForm) return values;
        return null;
    }

    return {
        values,
        handleChange,
        onFocus,
        handleSubmit
    }

}