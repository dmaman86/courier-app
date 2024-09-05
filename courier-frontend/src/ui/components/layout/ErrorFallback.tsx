import { Alert, AlertTitle, Button, Container } from "@mui/material";
import { AxiosError } from "axios";

interface ErrorFallbackProps {
    error: AxiosError;
    resetErrorBoundary: () => void;
  }


export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {

    return (
        <>
            <Container maxWidth="sm" style={{ marginTop: '2rem'}}>
                <Alert severity="error">
                    <AlertTitle>Something went wrong</AlertTitle>
                    <p>{error.message}</p>
                    <Button variant="contained" color="primary" onClick={resetErrorBoundary}>Back</Button>
                </Alert>
            </Container>
        </>
    )
    
}