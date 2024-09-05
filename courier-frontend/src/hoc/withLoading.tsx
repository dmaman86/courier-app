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

/*const withLoading = <P extends object>(Component: React.ComponentType<P>) => {
    const WithLoadingComponent = (props: P & WithLoadingProps) => {
        const { isLoading, ...restProps } = props;

        if (isLoading) {
            return <CircularProgress disableShrink />;
        }

        return <Component {...(restProps as P)} />;
    };

    return WithLoadingComponent;
};

export default withLoading;*/