import { ReusableInput } from "../form";
import { StatusOrder } from "@/domain";
import { useStatusOrderForm } from "@/useCases";


interface StatusOrderFormProps {
    statusOrderId: number | null;
    onSubmit: (statusOrder: StatusOrder) => void;
}

export const StatusOrderForm = ({ statusOrderId, onSubmit }: StatusOrderFormProps) => {

    const { loading,
            formData,
            values,
            handleChange,
            onFocus,
            handleSubmit } = useStatusOrderForm(statusOrderId);

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const statusOrder = handleSubmit();
        if(statusOrder)
            onSubmit(statusOrder);
    }

    return (
        <>
            {
                (!loading && values) && (
                    <form onSubmit={ handleFormSubmit } className="row">
                        <div className="row pt-3">
                            <div className="col-md-4">
                                <ReusableInput 
                                    inputProps={{
                                        label: 'Status Order Name',
                                        name: 'name',
                                        type: 'text',
                                        value: values.name.value,
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
                                            value: values.description.value,
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