import { GenericInputProps } from "@/domain";

export const ReusableInput = ({ inputProps, onChange, onFocus, errorsMessage }: GenericInputProps) => {

    const InputComponent = inputProps.type === 'textarea' ? 'textarea' : 'input';

    return (
        <>
            {
                inputProps.label && (
                    <label htmlFor={inputProps.name} className="form-label">{inputProps.label}:</label>
                )
            }
            <InputComponent
                {...inputProps}
                id={inputProps.name}
                className="form-control"
                autoComplete="off"
                onChange={onChange}
                onFocus={() => onFocus(inputProps.name)}
            />
            {
                errorsMessage?.map((error, index) => (
                    <div key={index} className={`text-danger ${error === '' ? 'd-none' : ''}`}>{error}</div>
                ))
            }
        </>
    );
}