import { GenericInputProps } from "../../types";

export const ReusableInput = ({ inputProps, onChange, onFocus, errorMessage }: GenericInputProps) => {


    return (
        <div className="mb-3">
            <label className="form-label">{inputProps.label.charAt(0).toUpperCase() + inputProps.label.slice(1)}:</label>
            <input
                {...inputProps}
                className="form-control"
                autoComplete="off"
                onChange={onChange}
                onFocus={() => onFocus(inputProps.name)}
            />
            {errorMessage && (
                <div className="text-danger errormessage">{errorMessage}</div>
            )}
        </div>
    );
}