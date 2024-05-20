import { Stack, Alert, styled } from "@mui/material";

import { ValidationRule } from "../../types";

interface Props{
    rules: ValidationRule[];
    value: string;
}

const CustomAlert = styled(Alert)({
    backgroundColor: 'transparent',
    padding: '0px',
    '& .MuiAlert-message': {
        color: 'inherit',
    }
});

export const PasswordRulesList = ({ rules, value }: Props) => {

    return(
        <>
            <Stack sx={{ width: '100%' }}>
                {
                    rules.map((rule, index) => (
                        <CustomAlert
                            key={index}
                            severity={rule.validate(value) ? 'success' : 'error'}
                        >
                            { rule.message }
                        </CustomAlert>
                    ))
                }
            </Stack>
        </>
    );
}