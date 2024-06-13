import { useEffect, useState } from "react";
import { Container, Grid, Paper, Typography, Stack, Button } from "@mui/material";
import { useErrorBoundary } from "react-error-boundary";

import { useAuth } from "@/hooks";
import { Branch, Client, Role, User } from "@/types";

import { GenericModal, UpdatePassword, UserForm } from "@/components/modal";


export const Profile = () => {

    const { userDetails } = useAuth();

    const [ showModalPassword, setShowModalPassword ] = useState(false);
    const [ showModalDetails, setShowModalDetails ] = useState(false);

    const [ isClient, setIsClient ] = useState<boolean>(false);

    const toogleModalPassword = () => setShowModalPassword(!showModalPassword);

    const toogleModalDetails = () => setShowModalDetails(!showModalDetails);

    useEffect(() => {
        if(userDetails) console.log(userDetails);
    }, [userDetails]);

    useEffect(() => {
        if(userDetails){
            console.log(userDetails);
            setIsClient(userDetails.roles.some(role => role.name === 'ROLE_CLIENT'))
        }
    }, [userDetails]);

    const handleFormSubmit = (user: User) => {
        console.log(user);
    }

    const extractRoleNames = (user: User | Client) => {
        const formattedRoles = user.roles.map((role: Role) => {
            return role.name.replace(/^ROLE_/, '');
        });
        return `[${formattedRoles?.join(', ')}]`;
    }

    const extractBranchDetails = (user: Client) => {
        const formattedBranches = user.branches.map((branch: Branch) => {
            return `${branch.address} - ${branch.city}`;
        });
        return `[${formattedBranches.join(", \n")}]`;
    }

    const capitalizeFirstLetter = (word: string | undefined) => {
        return word ? word.replace(/^\w/, (c) => c.toUpperCase()) : '';
    }

    return(
        <>
        {
            userDetails && (
                <Container sx={{ pt: 5}}>
                    <Grid container justifyContent='center'>
                        <Grid item lg={10}>
                            <Paper elevation={3} sx={{ p: 3 }}>
                                <Typography variant="h4" align="center" gutterBottom>
                                    Account Overview
                                </Typography>
                                <Grid container spacing={2} justifyContent="center" textAlign="center">
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Email: {userDetails.email}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Full name: {capitalizeFirstLetter(userDetails.name) + ' ' + capitalizeFirstLetter(userDetails.lastName)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Phone: {userDetails.phone}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Roles: {extractRoleNames(userDetails)}
                                        </Typography>
                                    </Grid>
                                    {
                                        isClient && (
                                            <>
                                                <Grid item xs={12}>
                                                    <Typography variant="h6">
                                                        Office: {(userDetails as Client).office.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="h6" component="pre">
                                                        Branch: {extractBranchDetails((userDetails as Client))}
                                                    </Typography>
                                                </Grid>
                                            </>
                                        )
                                    }
                                    <Grid item xs={12}>
                                        <Stack spacing={2} direction={'row'} justifyContent='center'>
                                            <Button variant="contained" color="primary" onClick={toogleModalDetails}>Update details</Button>
                                            <Button variant="contained" color="primary" onClick={toogleModalPassword}>Update password</Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            )
        }
        {                
            (userDetails && showModalPassword) && <GenericModal title="Generic modal" body={<UpdatePassword user={userDetails} onClose={toogleModalPassword} />} show={showModalPassword} onClose={toogleModalPassword} />
        }
        {
            (userDetails && showModalDetails) && <GenericModal title="Update details" body={<UserForm userId={userDetails.id} onSubmit={handleFormSubmit}/>} show={showModalDetails} onClose={toogleModalDetails}/>
        }
        </>
    );
}