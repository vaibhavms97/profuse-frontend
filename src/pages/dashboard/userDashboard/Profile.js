import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  getUserProfileRequest,
  updateUserProfileRequest,
} from "../../../services/authServices";
import _ from "lodash";
import { toast } from "material-react-toastify";
import { LoadingButton } from "@mui/lab";
import Loader from "../../../components/common/Loader";

export default function Profile() {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [updatedUserDetails, setUpdatedUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errorDetails, setErrorDetails] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const [isUpdated, setIsUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);

  useEffect(() => {
    setIsFetchingData(true);
    getUserProfileRequest()
      .then((res) => {
        const data = res.data.data.user
        if(!data.phone) {
          data.phone = ""
        }
        setUserDetails(data);
        setUpdatedUserDetails(data);
      })
      .finally(() => {
        setIsFetchingData(false);
      });
  }, []);

  useEffect(() => {
    if (_.isEqual(userDetails, updatedUserDetails)) {
      setIsUpdated(false);
    } else {
      setIsUpdated(true);
    }
  },[updatedUserDetails, userDetails])

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setUpdatedUserDetails((prev) => ({ ...prev, [name]: value }));
  }

  function handleCancel() {
    setUpdatedUserDetails(userDetails);
  }

  function handleUpdate() {
    let isError = false;
    const errors = {
      name: "",
      email: "",
      phoneNumber: "",
    };
    if (!updatedUserDetails.name) {
      errors.name = "Please enter name";
      isError(true);
    }
    if (isError) {
      setErrorDetails(errors);
    }
    if (!isError) {
      setIsLoading(true);
      setErrorDetails(errors);
      updateUserProfileRequest(updatedUserDetails)
        .then((res) => {
          if (res.data.status === 200) {
            toast.success("Profile updated successfully");
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  return (
    <>
      {isFetchingData && <Loader/>}
      <Box pl="240px">
        <Box m={4}>
          <Box>
            <Typography variant="h4">Profile</Typography>
          </Box>
          <Box maxWidth="400px">
            <TextField
              sx={{ my: 2.5 }}
              label="Name"
              name="name"
              onChange={handleChange}
              value={updatedUserDetails.name}
              error={errorDetails.name ? true : false}
              helperText={errorDetails.name}
              fullWidth
              required
              placeholder="Enter Your Name"
            />
            <TextField
              sx={{ my: 2.5 }}
              label="Phone Number"
              name="phone"
              onChange={handleChange}
              value={updatedUserDetails.phone}
              error={errorDetails.phone ? true : false}
              helperText={errorDetails.phone}
              fullWidth
              placeholder="Enter Your Phone number"
            />
            <TextField
              sx={{ my: 2.5 }}
              label="Email"
              name="email"
              value={updatedUserDetails.email}
              fullWidth
              disabled
            />
            <Box display="flex" justifyContent="space-around">
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancel}
                size="large"
                sx={{ my: 2.5, width:"150px" }}
              >
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                onClick={handleUpdate}
                disabled={!isUpdated}
                loading={isLoading}
                loadingPosition="start"
                size="large"
                sx={{ my: 2.5, width:"150px" }}
              >
                Update
              </LoadingButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
