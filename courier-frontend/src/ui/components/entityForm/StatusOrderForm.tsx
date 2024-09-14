import { ReusableInput } from "../form";
import { FormProps, FormState, StatusOrder } from "@/domain";
import { validatorForm } from "@/helpers";
import { useForm } from "@/hooks";

export const StatusOrderForm = <T extends StatusOrder>({ item, onSubmit }: FormProps<T>) => {

    const initialState: FormState = {
        name: {
            value: item.name,
            validation: [ validatorForm.validateNotEmpty ],
            validateRealTime: false
        },
        description: {
            value: item.description,
            validation: [ validatorForm.validateNotEmpty ],
            validateRealTime: false
        }
    };

    const { values, state, handleChange, onFocus, validateForm } = useForm(item, initialState);

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const statusOrder = validateForm();
        if(statusOrder)
            onSubmit(statusOrder);
    }

    return (
        <>
            {
                (values) && (
                    <form onSubmit={ handleFormSubmit } className="row">
                        <div className="row pt-3">
                            <div className="col-md-4">
                                <ReusableInput 
                                    inputProps={{
                                        label: 'Status Order Name',
                                        name: 'name',
                                        type: 'text',
                                        value: state.name,
                                        placeholder: 'Enter status order name'
                                    }}
                                    onChange={handleChange}
                                    onFocus={onFocus}
                                    errorsMessage={values.name.error}
                                />
                            </div>
                            <div className="col-md-8">
                                <ReusableInput 
                                        inputProps={{
                                            label: 'Description Order',
                                            name: 'description',
                                            type: 'textarea',
                                            value: state.description,
                                            placeholder: 'Enter description order'
                                        }}
                                        onChange={handleChange}
                                        onFocus={onFocus}
                                        errorsMessage={values.description.error}
                                    />
                            </div>
                        </div>                          
                        <div className="row">
                            <div className="col pt-3 text-center">
                                <button className="btn btn-primary" type="submit">Save</button>
                            </div>
                        </div>
                    </form>
                )
            }
        </>
    );
}