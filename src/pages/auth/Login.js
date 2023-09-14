import { useEffect, useState } from "react";
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
import { userAuthLoginRequest } from "../../services/authServices";
import { toast } from "material-react-toastify";

export default function Login() {
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });

  const [errorDetails, setErrorDetails] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    const role = localStorage.getItem("role");
    if(uid && role === "Admin") {
      navigate("/admin-dashboard")
    } else if(uid && role === "User") {
      navigate("/user-dashboard")
    }
  },[])

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setLoginCredentials((prev) => ({ ...prev, [name]: value }));
  }

  function handleLogin() {
    let error = {
      email: "",
      password: "",
    }
    let isError = false;
    if(!loginCredentials.email) {
      error.email = "Please enter email"
      isError = true
    }
    if(!loginCredentials.password) {
      error.password = "Please enter password"
      isError = true
    }

    if(isError) {
      setErrorDetails(error)
    } else {
      setErrorDetails(error)
      const data = {
        name: loginCredentials.fullName,
        email: loginCredentials.email,
        password: loginCredentials.password
      }
      setIsLoading(true);
      userAuthLoginRequest(data)
      .then(res => {
        if(res.data.status === 200) {
          toast.success("User logged in successfully")
          localStorage.setItem("token", res.data.data.token)
          localStorage.setItem("uid", res.data.data.user._id)
          localStorage.setItem("role", res.data.data.user.role)
          if(res.data.data.user.role === "User") {
            navigate("/user-dashboard")
          } else if(res.data.data.user.role === "Admin") {
            navigate("/admin-dashboard")
          }
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
          fontFamily="Recoleta-bold"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <BoltIcon sx={{ fontSize: "42px" }} />
          Profuse
        </Typography>
        <Box mt={2.5} width={400}>
          <Typography variant="h4" textAlign="left" fontFamily="Recoleta-bold">
            Login
          </Typography>
          <TextField
            sx={{ my: 2.5 }}
            label="Email"
            name="email"
            onChange={handleChange}
            value={loginCredentials.email}
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
            value={loginCredentials.password}
            error={errorDetails.password ? true : false}
            helperText={errorDetails.password}
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
            Login
          </LoadingButton>
          <Box display="flex" alignItems="center">
            <Typography>Not registered yet?</Typography>
            <Link to="/signUp" style={{textDecoration: "none", color:"#48484e9"}}>Create an Account</Link>
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
