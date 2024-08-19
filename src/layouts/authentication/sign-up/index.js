import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { database } from "../FirebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification, getAuth } from "firebase/auth";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
  IconButton,
  OutlinedInput,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { styled } from "@mui/system";
import "./signUP.css";

const GradientBox = styled(Box)`
  border: 2px solid transparent;
  border-radius: 15px;
  background-image: linear-gradient(white, white),
    linear-gradient(to right, blue, green, yellow, orange, green);
  background-origin: border-box;
  background-clip: padding-box, border-box;
`;
function Cover() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const auth = getAuth();
  const navigate = useNavigate();
  //const onSubmit = (data) => console.log(data);
  const onSubmit = (data) => {
    const email = data.email;
    const password = data.password;

    createUserWithEmailAndPassword(database, email, password).then((data) => {
      console.log(data, "authData");
      sendEmailVerification(auth.currentUser).then(() => {
        alert("email sent! please verify...");
        navigate('/authentication/sign-in');
      });
    });
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <CoverLayout image={bgImage}>
      <GradientBox>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={1}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h6" fontWeight="medium" color="white" mt={1}>
              Join us today
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Enter your email and password to register
            </MDTypography>
          </MDBox>
          <form onSubmit={handleSubmit(onSubmit)}>
            <MDBox pt={4} pb={3} px={3}>
              <MDBox>
                <MDBox mb={2}>
                  <TextField
                    {...register("name", {
                      required: "Name is required",
                      maxLength: { value: 20, message: "Name cannot exceed 20 characters" },
                    })}
                    aria-invalid={errors.name ? "true" : "false"}
                    sx={{ width: "100%" }}
                    label="Name"
                  />
                  {errors.name?.type === "required" && (
                    <p className="error" role="alert">
                      Name is required
                    </p>
                  )}
                  {errors.name?.type === "maxLength" && (
                    <p className="error" role="alert">
                      {errors.name.message}
                    </p>
                  )}
                </MDBox>
                <MDBox mb={2}>
                  <TextField
                    {...register("email", {
                      required: "Email is required",
                      maxLength: { value: 40, message: "Email cannot exceed 40 characters" },
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
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
                  {errors.email?.type === "maxLength" && (
                    <p className="error" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                  {errors.email?.type === "pattern" && (
                    <p className="error" role="alert">
                      {errors.email.message}
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
                        pattern: {
                          value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                          message:
                            "Password must contain at least 8 characters, one letter, one number, and one special character",
                        },
                      })}
                      aria-invalid={errors.password ? "true" : "false"}
                      label="Password"
                    />
                    {errors.password?.type === "required" && (
                      <p className="error" role="alert">
                        Password is required
                      </p>
                    )}
                    {errors.password?.type === "pattern" && (
                      <p className="error" role="alert">
                        {errors.password.message}
                      </p>
                    )}
                  </FormControl>
                </MDBox>
                <MDBox display="flex" alignItems="center" ml={-1}>
                  <Checkbox {...register("terms", { required: "You must check the box" })} />
                  <MDTypography
                    variant="button"
                    fontWeight="regular"
                    color="text"
                    sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                  >
                    &nbsp;&nbsp;I agree the&nbsp;
                  </MDTypography>
                  <MDTypography
                    component="a"
                    href="#"
                    variant="button"
                    fontWeight="bold"
                    color="info"
                    textGradient
                  >
                    Terms and Conditions
                  </MDTypography>
                </MDBox>
                {errors.terms && (
                  <p className="error" role="alert">
                    {errors.terms.message}
                  </p>
                )}
                <MDBox mt={4} mb={1}>
                  <MDButton variant="gradient" color="info" fullWidth type="submit">
                    sign Up
                  </MDButton>
                </MDBox>
                <MDBox mt={3} mb={1} textAlign="center">
                  <MDTypography variant="button" color="text">
                    Already have an account?{" "}
                    <MDTypography
                      component={Link}
                      to="/authentication/sign-in"
                      variant="button"
                      color="info"
                      fontWeight="medium"
                      textGradient
                    >
                      Sign In
                    </MDTypography>
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>
          </form>
        </Card>
      </GradientBox>
    </CoverLayout>
  );
}

export default Cover;
