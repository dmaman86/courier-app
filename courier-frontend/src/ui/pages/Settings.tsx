import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { userAdapter } from "@/adapters";
import { useAsync, useAuth, useFetch, useSnackbar } from "@/hooks";
import { BranchBase, Client, ROLES, User } from "@/models";
import { serviceRequest } from "@/services";
import { urlPaths } from "@/utilities";
import { Input } from "../components";

const validationSchema = yup.object({
  currentPassword: yup
    .string()
    .required("This field is required")
    .min(6, "Password must be at least 6 characters"),
  newPassword: yup
    .string()
    .required("This field is required")
    .min(6, "Password must be at least 6 characters"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "The fields do not match")
    .required("This field is required"),
});

export const Settings = () => {
  const { auth } = useAuth();
  const { error, success } = useSnackbar();

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    clearErrors,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    criteriaMode: "all",
  });

  const [currentUser, setCurrentUser] = useState<User | Client | null>(null);

  const { loading, callEndPoint } = useFetch();

  const [expandedPanels, setExpandedPanels] = useState<Record<string, boolean>>(
    {
      panel1: false,
    },
  );

  const isClient = auth.roles?.some((role) => role.name === ROLES.CLIENT);

  useAsync(
    async () => {
      if (!currentUser && auth.id) {
        return await callEndPoint(
          serviceRequest.getItem(`${urlPaths.user.base}/${auth.id}`),
          userAdapter.userFormDtoToEntity,
        );
      }
      return { data: null, error: null };
    },
    (response) => {
      if (!response.error && response.data) {
        setCurrentUser(response.data);
      }
    },
    () => {},
    [currentUser, auth.id],
  );

  const extractBranchDetails = (branches: BranchBase[]) => {
    const formattedBranches = branches.map(
      (branch) => `${branch.address} - ${branch.city}`,
    );
    return `[${formattedBranches.join(", \n")}]`;
  };

  const onSubmit = async (data: any) => {
    console.log("Form submited: ", data);
    const res = await callEndPoint(
      serviceRequest.postItem(urlPaths.credential.update, {
        userId: auth.id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    );

    if (!loading) {
      if (!res.error && res.data) {
        success("Password updated successfully");
        reset();
        handleCancel("panel1");
      } else {
        error("An error occurred while updating password");
      }
    }
  };

  const handleToggle =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPanels((prev) => ({
        ...prev,
        [panel]: isExpanded,
      }));
      if (!isExpanded) {
        reset();
      }
    };

  const handleCancel = (panel: string) => {
    setExpandedPanels((prev) => ({
      ...prev,
      [panel]: false,
    }));
  };

  return (
    <>
      {!loading && currentUser && (
        <Grid container sx={{ justifyContent: "center", alignItems: "center" }}>
          <Grid columns={{ xs: 12, sm: 10, md: 8 }}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h4" align="center" gutterBottom>
                Account Overview
              </Typography>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                textAlign="center"
              >
                <Grid size={12}>
                  <Typography variant="h6">
                    Welcome, {currentUser.fullName}! Here is an overview of your
                    account.
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="h6">
                    Email: {currentUser.email}
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="h6">
                    Phone Number: {currentUser.phoneNumber}
                  </Typography>
                </Grid>
                {isClient && (
                  <>
                    <Grid size={12}>
                      <Typography variant="h6">
                        Office: {(currentUser as Client).office.name}
                      </Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography variant="h6">
                        Branches:{" "}
                        {extractBranchDetails((currentUser as Client).branches)}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Accordion
                  sx={{ mt: 4 }}
                  expanded={expandedPanels.panel1}
                  onChange={handleToggle("panel1")}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="change-password-content"
                    id="change-password-header"
                  >
                    <Typography component="span" variant="h6">
                      Change Password
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid size={12}>
                        <Input
                          register={register}
                          name="currentPassword"
                          errors={errors}
                          label="Current Password"
                          type="password"
                          trigger={trigger}
                          clearErrors={clearErrors}
                          watch={watch}
                        />
                      </Grid>
                      <Grid size={12}>
                        <Input
                          register={register}
                          name="newPassword"
                          errors={errors}
                          label="New Password"
                          type="password"
                          trigger={trigger}
                          clearErrors={clearErrors}
                          watch={watch}
                        />
                      </Grid>
                      <Grid size={12}>
                        <Input
                          register={register}
                          name="confirmNewPassword"
                          errors={errors}
                          label="Confirm New Password"
                          type="password"
                          trigger={trigger}
                          clearErrors={clearErrors}
                          watch={watch}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                  <AccordionActions>
                    <Button
                      color="secondary"
                      type="button"
                      onClick={() => {
                        reset();
                        handleCancel("panel1");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button variant="contained" color="primary" type="submit">
                      Save
                    </Button>
                  </AccordionActions>
                </Accordion>
              </form>
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
};
