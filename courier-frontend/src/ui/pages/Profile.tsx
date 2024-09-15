import { useEffect, useState } from "react";
import { Container, Grid, Paper, Typography, Stack, Button } from "@mui/material";

import { Branch, Client, Role, UpdatePasswordForm, User } from "@/domain";
import { CustomDialog, UpdatePassword, UserForm } from "@/ui";
import { PageProps } from "./interface";
import { withLoading } from "@/hoc";


const Profile = ({ userDetails }: PageProps) => {

    const [ dialog, setDialog ] = useState<boolean>(false);
 
    const [ isClient, setIsClient ] = useState<boolean>(false);
    const [ userWithPassword, setUserWithPassword ] = useState<UpdatePasswordForm | null>(null);

    const [ title, setTitle ] = useState<string>('');
    const [ content, setContent ] = useState<React.ReactNode>(null);

    useEffect(() => {
        if (userDetails) {
          setUserWithPassword({
            ...userDetails,
            password: '',
            confirmPassword: ''
          });
        }
    }, [userDetails]);

    const handleFormSubmit = (user: User | UpdatePasswordForm) => {
        console.log(user);
    }

    const handleClose = () => {
        setDialog(false);
        setTitle('');
        setContent(null);
    }

    const handleEditDetails = () => {
        setTitle('Update details');
        setContent(<UserForm item={userDetails!} onSubmit={handleFormSubmit} onClose={handleClose}/>);
        setDialog(true);
    }

    const handleEditPassword = () => {
        setTitle('Update password');
        setContent(userWithPassword && <UpdatePassword item={userWithPassword} onSubmit={handleFormSubmit} onClose={handleClose} />);
        setDialog(true);
    }

    useEffect(() => {
        if(userDetails) console.log(userDetails);
    }, [userDetails]);

    useEffect(() => {
        if(userDetails){
            console.log(userDetails);
            setIsClient(userDetails.roles.some(role => role.name === 'ROLE_CLIENT'))
        }
    }, [userDetails]);

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
                                        <Button variant="contained" color="primary" onClick={handleEditDetails}>Update details</Button>
                                        <Button variant="contained" color="primary" onClick={handleEditPassword}>Update password</Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            <CustomDialog
                open={dialog}
                title={title}
                content={content}
                onClose={handleClose} 
            />
        </>
    );
}

export default withLoading(Profile);