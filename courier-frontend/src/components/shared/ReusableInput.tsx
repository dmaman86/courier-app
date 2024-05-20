import { GenericInputProps } from "../../types";

export const ReusableInput = ({ inputProps, onChange, onFocus, errorMessage }: GenericInputProps) => {


    return (
        <>
            {
                inputProps.label && (
                    <label className="form-label">{inputProps.label}:</label>
                )
            }
            <input
                {...inputProps}
                className="form-control"
                autoComplete="off"
                onChange={onChange}
                onFocus={() => onFocus(inputProps.name)}
            />
            <div className={`text-danger errormessage ${errorMessage ? '' : 'd-none'}`}>{errorMessage}</div>
        </>
    );
}