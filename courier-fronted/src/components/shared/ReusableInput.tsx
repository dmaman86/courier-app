import React from "react";
import { GenericInputProps } from "../../types";

export const ReusableInput: React.FC<GenericInputProps> = ({ inputProps, onChange }) => {

    return (
        <div className="mb-3">
            <label className="form-label">{inputProps.label.charAt(0).toUpperCase() + inputProps.label.slice(1)}:</label>
            <input
                {...inputProps}
                className="form-control"
                autoComplete="off"
                onChange={onChange}
                // onFocus={onFocusReset}
            />
        </div>
    );
}