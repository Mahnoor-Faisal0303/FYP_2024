import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth ,signOut} from "firebase/auth"
import Card from "@mui/material/Card";
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
import { Box, Button } from "@mui/material";

const GradientBox = styled(Box)`
  border: 2px solid transparent;
  border-radius: 15px;
  background-image: linear-gradient(white, white), linear-gradient(to right, blue, green, yellow,orange,green);
  background-origin: border-box;
  background-clip: padding-box, border-box;
`;

const Basic = () => {

  const navigate = useNavigate();
  const auth = getAuth();
  const signout = () => {
    // signOut(auth.currentUser);
    signOut(auth).then(() => {
      navigate("/authentication/sign-in");
      console.log("signout")
    }).catch((error) => {
      console.error(error);
    });
  }
  const gotoDashboard = () => {
    console.log("go to dashboard");
    navigate("/dashboard");
  }

  return (
    <BasicLayout image={bgImage}>
      <GradientBox>
      <Card>
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
            Sign Out
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
              Are you sure you want to SignOut?
            </MDBox>

            <MDBox mt={4} mb={1} sx={{display:"flex"}}>
              <MDButton variant="gradient" color="info" onClick={signout} sx={{marginRight:"14px"}}>
                yes
              </MDButton>
              <MDButton variant="gradient" color="dark" onClick={gotoDashboard}>
                No
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      </GradientBox>
    </BasicLayout>
  );
}

export default Basic;
