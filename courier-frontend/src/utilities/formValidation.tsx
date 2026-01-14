import { ErrorMessage } from "@hookform/error-message";
import { Alert } from "@mui/material";
import { FieldErrors, ValidateResult } from "react-hook-form";

export const formValidation = (errors: FieldErrors, errorKey: string) => {
  return (
    <ErrorMessage
      errors={errors}
      name={errorKey}
      render={({ messages }: { messages?: Record<string, ValidateResult> }) => {
        const errorsList: ValidateResult[] = messages
          ? Object.values(messages)
          : errors[errorKey]
            ? [errors[errorKey]?.message as ValidateResult]
            : [];

        return (
          <>
            {errorsList.map((msg, index) => (
              <Alert
                key={index}
                severity="error"
                style={{ marginTop: "0.25rem" }}
              >
                {msg}
              </Alert>
            ))}
          </>
        );
      }}
    />
  );
};
