import { useState } from "react";
import LoginImage from "../../assets/images/login.png";
import BoltIcon from "@mui/icons-material/Bolt";
import {
  Grid,
  Typography,
  TextField,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { Link, useNavigate } from "react-router-dom";
import { adminAuthSignUpRequest } from "../../services/authServices";
import { toast } from "material-react-toastify";

export default function AdminSignUp() {
  const [signUpCredentials, setSignUpCredentials] = useState({
    fullName:"",
    email: "",
    password: "",
    confirmPassword:"",
  });

  const [errorDetails, setErrorDetails] = useState({
    fullName:"",
    email: "",
    password: "",
    confirmPassword:"",
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setSignUpCredentials((prev) => ({ ...prev, [name]: value }));
  }

  function handleLogin() {
    let error = {
      fullName:"",
      email: "",
      password: "",
      confirmPassword:"",
    }
    let isError = false;
    if(!signUpCredentials.fullName) {
      error.fullName = "Please enter full name"
      isError = true
    }
    if(!signUpCredentials.email) {
      error.email = "Please enter email"
      isError = true
    }
    if(!signUpCredentials.password) {
      error.password = "Please enter password"
      isError = true
    }
    if(!signUpCredentials.confirmPassword) {
      error.password = "Please enter confirm password"
      isError = true
    }
    if(signUpCredentials.confirmPassword !== signUpCredentials.password) {
      error.password = "Passwords doesn't match"
      isError = true
    }

    if(isError) {
      setErrorDetails(error)
    } else {
      setErrorDetails(error)
      const data = {
        name: signUpCredentials.fullName,
        email: signUpCredentials.email,
        password: signUpCredentials.password
      }
      setIsLoading(true);
      adminAuthSignUpRequest(data)
      .then(res => {
        if(res.data.status === 200) {
          toast.success("Admin registered successfully")
          navigate("/login");
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(err => {
        console.log(err);
        toast.error(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      })
    }

  }

  return (
    <Grid container maxHeight="100vh" overflow="hidden">
      <Grid
        item
        xs={6}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Typography
          color="#4848e9"
          variant="h3"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <BoltIcon sx={{ fontSize: "42px" }} />
          Profuse
        </Typography>
        <Box mt={2.5} width={400}>
          <Typography variant="h4" textAlign="left">
            Admin Sign Up
          </Typography>
          <TextField
            sx={{ my: 2.5 }}
            label="Full name"
            name="fullName"
            onChange={handleChange}
            value={signUpCredentials.fullName}
            error={errorDetails.fullName ? true : false}
            helperText={errorDetails.fullName}
            fullWidth
            required
            placeholder="Enter Your Fullname"
          />
          <TextField
            sx={{ mb: 2.5 }}
            label="Email"
            name="email"
            onChange={handleChange}
            value={signUpCredentials.email}
            error={errorDetails.email ? true : false}
            helperText={errorDetails.email}
            fullWidth
            required
            placeholder="Enter Your Email"
          />
          <TextField
            sx={{ mb: 2.5 }}
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            value={signUpCredentials.password}
            error={errorDetails.password ? true : false}
            helperText={errorDetails.password}
            fullWidth
            required
            placeholder="Enter Your Password"
          />
          <TextField
            sx={{ mb: 2.5 }}
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            onChange={handleChange}
            value={signUpCredentials.confirmPassword}
            error={errorDetails.confirmPassword ? true : false}
            helperText={errorDetails.confirmPassword}
            fullWidth
            required
            placeholder="Enter Your Password"
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Remember me"
              />
            </FormGroup>
            <Typography color="#4848e9">Forgot Password?</Typography>
          </Box>
          <LoadingButton
            loading = {isLoading}
            loadingPosition="start"
            variant="contained"
            sx={{ my: 2.5 }}
            size="large"
            fullWidth
            onClick={handleLogin}
          >
            Sign Up
          </LoadingButton>
          <Box display="flex" alignItems="center">
            <Typography>Already a User?</Typography>
            <Link to="/login" style={{textDecoration: "none", color:"#48484e9"}}>Login</Link>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <img
          alt="loginImage"
          src={LoginImage}
          style={{ height: "100vh", width: "100%" }}
        />
      </Grid>
    </Grid>
  );
}
