import React from "react";
import { ValidationRule } from "../../types";

interface Props{
    rules: ValidationRule[];
    value: string;
}

export const PasswordRulesList: React.FC<Props> = ({ rules, value }) => {

    return(
        <>
            <ul>
                {
                    rules.map((rule, index) => (
                        <li key={index} style={{ color: rule.validate(value) ? 'green' : 'red' }}>
                            { rule.message }
                        </li>
                    ))
                }
            </ul>
        </>
    );
}