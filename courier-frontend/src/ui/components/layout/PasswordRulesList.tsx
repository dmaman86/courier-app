import { Stack, Alert, styled } from "@mui/material";

import { ValidationRule } from "@/domain";

interface Props{
    rules: ValidationRule[];
    errors?: string[];
}

const CustomAlert = styled(Alert)({
    backgroundColor: 'transparent',
    padding: '0px',
    '& .MuiAlert-message': {
        color: 'inherit',
    }
});

export const PasswordRulesList = ({ rules, errors }: Props) => {

    return(
        <>
            <Stack sx={{ width: '100%' }}>
                {
                    rules.map((rule, index) => (
                        <CustomAlert
                            key={index}
                            severity={!errors ? 'error' : errors[index] === '' ? 'success' : 'error'}
                        >
                            { rule.message }
                        </CustomAlert>
                    ))
                }
            </Stack>
        </>
    );
}