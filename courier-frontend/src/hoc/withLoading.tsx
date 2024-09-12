import React from "react";
import { Box, CircularProgress } from "@mui/material";


interface WithLoadingProps {
    isLoading: boolean;
}

const withLoading = <P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P & WithLoadingProps> => {
    return ({ isLoading, ...props }: WithLoadingProps & P) => {
        if(isLoading){
            return (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress disableShrink />
                </Box>
            );
        }
        return <WrappedComponent {...(props as P)} />;
    }
}

export default withLoading;