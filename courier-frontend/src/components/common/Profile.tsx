import { useEffect, useState } from "react";
import { Container, Grid, Paper, Typography, Stack, Button } from "@mui/material";

import { useAuth, useFetchAndLoad } from "../../hooks";
import { Branch, Client, FetchResponse, Role, User } from "../../types";
import { GenericModal, UpdatePassword, UserForm } from "../modal";
import { serviceRequest } from "../../services";
import { paths } from "../../helpers";

export const Profile = () => {

    const { userDetails } = useAuth();
    const [ showModalPassword, setShowModalPassword ] = useState(false);
    const [ showModalDetails, setShowModalDetails ] = useState(false);

    const { loading, callEndPoint } = useFetchAndLoad();
    const [ user, setUser ] = useState<User | Client | null>(null);
    const [ responseFetchDetails, setResponseFetchDetails ] = useState<FetchResponse<User | Client>>({ data: null, error: null });
    const [ isClient, setIsClient ] = useState<boolean>(false);

    const toogleModalPassword = () => setShowModalPassword(!showModalPassword);

    const toogleModalDetails = () => setShowModalDetails(!showModalDetails);


    useEffect(() => {
        if(userDetails !== null && !responseFetchDetails.data && !responseFetchDetails.error){
            const fetchUserDetails = async () => {
                const response = await callEndPoint(serviceRequest.getItem<User | Client>(`${paths.courier.users}id/${userDetails.id}`));
                setResponseFetchDetails(response);
            };
            fetchUserDetails();
        }
    }, [userDetails, callEndPoint, responseFetchDetails]);

    useEffect(() => {
        if(!loading && responseFetchDetails.data && !responseFetchDetails.error && user === null){
            const userRes = responseFetchDetails.data as User | Client;
            setUser(userRes);
        }
    }, [loading, responseFetchDetails, user]);

    useEffect(() => {
        if(user){
            setIsClient(user.roles.some(role => role.name === 'ROLE_CLIENT'))
        }
    }, [user]);

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
            user && (
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
                                            Email: {user.email}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Full name: {capitalizeFirstLetter(user.name) + ' ' + capitalizeFirstLetter(user.lastName)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Phone: {user.phone}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Roles: {extractRoleNames(user)}
                                        </Typography>
                                    </Grid>
                                    {
                                        isClient && (
                                            <>
                                                <Grid item xs={12}>
                                                    <Typography variant="h6">
                                                        Office: {(user as Client).office.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="h6" component="pre">
                                                        Branch: {extractBranchDetails((user as Client))}
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
            (user && showModalPassword) && <GenericModal title="Generic modal" body={<UpdatePassword user={user} onClose={toogleModalPassword} />} show={showModalPassword} onClose={toogleModalPassword} />
        }
        {
            (user && showModalDetails) && <GenericModal title="Update details" body={<UserForm userId={user.id} onSubmit={handleFormSubmit}/>} show={showModalDetails} onClose={toogleModalDetails}/>
        }
        </>
    );
}