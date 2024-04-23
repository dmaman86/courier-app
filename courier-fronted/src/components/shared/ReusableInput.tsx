import React from "react";
import { InputOptions } from "../../types/input.options.type";

export const ReusableInput: React.FC<InputOptions> = ({ label, type, value, onChange, error, resetError, placeholder }) => {

    const onFocusReset = (event: React.FocusEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (resetError) {
            resetError();
        }
    };

    return (
        <div className="mb-3">
            <label className="form-label">{label.charAt(0).toUpperCase() + label.slice(1)}:</label>
            <input
                type={type}
                name={label}
                className="form-control"
                placeholder={placeholder}
                autoComplete="off"
                value={value}
                onChange={onChange}
                onFocus={onFocusReset}
            />
            {error && <div className="text-danger errormessage">{error}</div>}
        </div>
    );
}