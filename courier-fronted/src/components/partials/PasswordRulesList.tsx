import { ValidationRule } from "../../types";

interface Props{
    rules: ValidationRule[];
    value: string;
}

export const PasswordRulesList = ({ rules, value }: Props) => {

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