import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Paper, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import { useAuth, useFetch, useSnackbar } from "@/hooks";
import { Input, SnackbarCloseAction } from "../components/";
import { validatorInput } from "@/utilities";
import { serviceRequest } from "@/services";

const validationSchema = yup.object({
  identifier: yup
    .string()
    .required("This field is required")
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$|^(05|\+9725)(\d{8}|\d-\d{7}|\d-\d{3}-\d{4}|\d-\d{4}-\d{3})$/,
      "Please enter a valid email address or phone number",
    ),
  password: yup
    .string()
    .required("This field is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "The fields do not match")
    .required("This field is required"),
});

export const SignUp = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { loading, callEndPoint } = useFetch();
  const { error, success } = useSnackbar();

  const {
    register,
    handleSubmit,
    trigger,
    clearErrors,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    criteriaMode: "all",
  });

  const [disabledButton, setDisabledButton] = useState<boolean>(true);

  const onSubmit = async (data: any) => {
    console.log("Form submited: ", data);

    const isEmail = validatorInput.isEmail.isValid(data.identifier);
    const isPhoneNumber = validatorInput.isPhoneNumber.isValid(data.identifier);

    const res = await callEndPoint(
      serviceRequest.postItem("/auth/signup", {
        email: isEmail ? data.identifier : null,
        phoneNumber: isPhoneNumber ? data.identifier : null,
        password: data.password.trim(),
      }),
    );

    if (!loading) {
      if (!res.error && !res.data) {
        success("Your account has been created! Redirecting to signin...");

        setTimeout(() => {
          navigate("/signin", { replace: true });
        }, 1500);
      } else {
        error(res.error?.message || "Signin failed. Please try again.", (key) =>
          SnackbarCloseAction(key),
        );
      }
    }
  };

  const handleSignIn = () => {
    navigate("/signin", { replace: true });
  };

  useEffect(() => {
    if (auth.id) {
      navigate("/home", { replace: true });
    }
  }, [auth.id]);

  useEffect(() => {
    setDisabledButton(!isValid);
  }, [isValid]);

  return (
    <>
      <Grid container sx={{ justifyContent: "center" }}>
        <Grid columns={{ xs: 12, md: 5, lg: 4 }}>
          <Paper
            variant="elevation"
            square={false}
            sx={{ p: 4, maxWidth: "600px", margin: "0 auto" }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={4}>
                <Grid size={12}>
                  <Typography
                    variant="body1"
                    component="label"
                    htmlFor="identifier"
                  >
                    Email or Phone Number:
                  </Typography>
                  <Input
                    register={register}
                    name="identifier"
                    errors={errors}
                    label="Email or Phone Number:"
                    type="text"
                    trigger={trigger}
                    clearErrors={clearErrors}
                    watch={watch}
                  />
                </Grid>
                <Grid size={12}>
                  <Typography
                    variant="body1"
                    component="label"
                    htmlFor="password"
                  >
                    Password:
                  </Typography>
                  <Input
                    register={register}
                    name="password"
                    errors={errors}
                    label="Password"
                    type="password"
                    trigger={trigger}
                    clearErrors={clearErrors}
                    watch={watch}
                  />
                </Grid>
                <Grid size={12}>
                  <Typography
                    variant="body1"
                    component="label"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password:
                  </Typography>
                  <Input
                    register={register}
                    name="confirmPassword"
                    errors={errors}
                    label="Confirm Password"
                    type="password"
                    trigger={trigger}
                    clearErrors={clearErrors}
                    watch={watch}
                  />
                </Grid>

                <Grid size={12} sx={{ textAlign: "center", pt: 3 }}>
                  <Stack spacing={2} direction="row" justifyContent="center">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={disabledButton}
                    >
                      Sign Up
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSignIn}
                    >
                      Sign In
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>

      {/* <div className="row justify-content-center"> */}
      {/*   <div className="col-lg-8"> */}
      {/*     <div className="card shadow"> */}
      {/*       <div className="card-body p-5"> */}
      {/*         <form onSubmit={handleSubmit(onSubmit)} className="row g-4"> */}
      {/*           <div className="col-12"> */}
      {/*             <label htmlFor="identifier" className="form-label"> */}
      {/*               Email or Phone Number: */}
      {/*             </label> */}
      {/*             <Input */}
      {/*               register={register} */}
      {/*               name="identifier" */}
      {/*               errors={errors} */}
      {/*               label="Email or Phone Number:" */}
      {/*               type="text" */}
      {/*               trigger={trigger} */}
      {/*               clearErrors={clearErrors} */}
      {/*             /> */}
      {/*           </div> */}
      {/**/}
      {/*           <div className="col-12"> */}
      {/*             <label htmlFor="password" className="form-label"> */}
      {/*               Password: */}
      {/*             </label> */}
      {/*             <Input */}
      {/*               register={register} */}
      {/*               name="password" */}
      {/*               errors={errors} */}
      {/*               label="Password" */}
      {/*               type="password" */}
      {/*               trigger={trigger} */}
      {/*               clearErrors={clearErrors} */}
      {/*             /> */}
      {/*           </div> */}
      {/**/}
      {/*           <div className="col-12"> */}
      {/*             <label htmlFor="confirmPassword" className="form-label"> */}
      {/*               Confirm Password: */}
      {/*             </label> */}
      {/*             <Input */}
      {/*               register={register} */}
      {/*               name="confirmPassword" */}
      {/*               errors={errors} */}
      {/*               label="Confirm Password" */}
      {/*               type="password" */}
      {/*               trigger={trigger} */}
      {/*               clearErrors={clearErrors} */}
      {/*             /> */}
      {/*           </div> */}
      {/**/}
      {/*           <div className="col pt-3 text-center"> */}
      {/*             <Stack spacing={2} direction="row" justifyContent="center"> */}
      {/*               <button */}
      {/*                 type="submit" */}
      {/*                 className="btn btn-primary" */}
      {/*                 disabled={disabledButton} */}
      {/*               > */}
      {/*                 Sign Up */}
      {/*               </button> */}
      {/*               <button */}
      {/*                 type="button" */}
      {/*                 className="btn btn-primary" */}
      {/*                 onClick={handleSignIn} */}
      {/*               > */}
      {/*                 Sign In */}
      {/*               </button> */}
      {/*             </Stack> */}
      {/*           </div> */}
      {/*         </form> */}
      {/*       </div> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* </div> */}
    </>
  );
};
