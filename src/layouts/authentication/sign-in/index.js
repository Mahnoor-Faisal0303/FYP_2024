import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,getAuth ,signOut} from "firebase/auth"
import { useForm, SubmitHandler } from "react-hook-form";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { styled } from "@mui/system";
import "../sign-up/signUP.css";
import { Box, TextField, FormControl,InputLabel, InputAdornment, IconButton, OutlinedInput } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const GradientBox = styled(Box)`
  border: 2px solid transparent;
  border-radius: 15px;
  background-image: linear-gradient(white, white), linear-gradient(to right, blue, green, yellow,orange,green);
  background-origin: border-box;
  background-clip: padding-box, border-box;
`;

function Basic() {

  const navigate = useNavigate();
  const auth = getAuth();

  const [rememberMe, setRememberMe] = useState(false);
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const { register, formState: { errors }, handleSubmit } = useForm();
  // const onSubmit = (data) => console.log(data);

  const onSubmit = (data) =>{
  signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            navigate("/home");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
      }


  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <BasicLayout image={bgImage}>
      <GradientBox>
      <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox>
            <MDBox mb={2}>
            <TextField
                    {...register("email", {
                      required: "Email is required",
                    })}
                    aria-invalid={errors.email ? "true" : "false"}
                    sx={{ width: "100%" }}
                    label="Email"
                  />
                  {errors.email?.type === "required" && (
                    <p className="error" role="alert">
                      Email is required
                    </p>
                  )}
            </MDBox>
            <MDBox mb={2}>
            <FormControl variant="outlined" sx={{ width: "100%" }}>
                    <InputLabel>Password</InputLabel>
                    <OutlinedInput
                      type={showPassword ? "password" : "text"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      {...register("password", {
                        required: "Password is required",
                      })}
                      aria-invalid={errors.password ? "true" : "false"}
                      label="Password"
                    />
                    {errors.password?.type === "required" && (
                      <p className="error" role="alert">
                        Password is required
                      </p>
                    )}
                  </FormControl>
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
        </form>
      </Card>
      </GradientBox>
    </BasicLayout>
  );
}

export default Basic;
