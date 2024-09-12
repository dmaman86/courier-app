import { ReusableInput } from "../form";
import { FormState, StatusOrder } from "@/domain";
import { validatorForm } from "@/helpers";
import { useForm } from "@/hooks";


interface StatusOrderFormProps {
    statusOrder: StatusOrder;
    setStatusOrder: (statusOrder: StatusOrder) => void;
    onSubmit: (statusOrder: StatusOrder) => void;
}

export const StatusOrderForm = ({ statusOrder, setStatusOrder, onSubmit }: StatusOrderFormProps) => {

    const initialState: FormState = {
        name: {
            value: statusOrder.name,
            validation: [ validatorForm.validateNotEmpty ],
            validateRealTime: false
        },
        description: {
            value: statusOrder.description,
            validation: [ validatorForm.validateNotEmpty ],
            validateRealTime: false
        }
    };

    const { values, state, handleChange, onFocus, validateForm } = useForm(statusOrder, initialState);

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