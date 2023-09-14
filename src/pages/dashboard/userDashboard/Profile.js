import {
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getUserProfileRequest,
  updateUserProfileRequest,
} from "../../../services/authServices";
import _ from "lodash";
import { toast } from "material-react-toastify";
import { LoadingButton } from "@mui/lab";
import Loader from "../../../components/common/Loader";
import { getDashboardRequest } from "../../../services/dashboardServices";
import {
  depositFundRequest,
  withdrawFundRequest,
} from "../../../services/adminService";
import useWindowResizeHandler from "../../../hooks/useWindowResizeHandler";

export default function Profile({ setSelectedTab }) {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [accountDetails, setAccountDetails] = useState({});

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
  const [money, setMoney] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const role = localStorage.getItem("role");
  const isValidScreenSize = useWindowResizeHandler();

  useEffect(() => {
    setIsFetchingData(true);
    const promises = [getUserProfileRequest(), getDashboardRequest()];
    Promise.all(promises)
      .then((res) => {
        setUserDetails(res[0].data.data.user);
        setUpdatedUserDetails(res[0].data.data.user);
        setAccountDetails(res[1].data.data.accountData);
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err);
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
  }, [updatedUserDetails, userDetails]);

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

  function handleWithdraw() {
    if (parseInt(accountDetails.account_balance) > parseInt(money) ) {
      setWithdrawLoading(true);
      withdrawFundRequest({ account_balance: money })
        .then((res) => {
          if (res.data.status === 200) {
            toast.success("Withdrawn successfully");
            setSelectedTab("dashboard");
          }
        })
        .catch((err) => {
          toast.error(err.message);
          console.log(err);
        })
        .finally(() => {
          setWithdrawLoading(false);
        });
    } else {
      toast.error("Sorry, you have insufficient balance");
    }
  }

  function handleAddMoney() {
    if (Number(accountDetails.vested_balance) + Number(money) > 10000) {
      const validAmount = 10000 - Number(accountDetails.vested_balance);
      toast.error(`Sorry you can add upto $${validAmount}`);
    } else {
      setAddLoading(true);
      depositFundRequest({ account_balance: money })
        .then((res) => {
          if (res.data.status === 200) {
            toast.success("Added to your wallet successfully");
            setSelectedTab("dashboard");
          }
        })
        .catch((err) => {
          toast.error(err.message);
          console.log(err);
        })
        .finally(() => {
          setAddLoading(false);
        });
    }
  }

  return (
    <>
      {isFetchingData && <Loader />}
      <Box pl={isValidScreenSize ? "240px" : "80px"}>
        <Box m={4}>
          <Grid container>
            <Grid item xs={6}>
              <Box>
                <Typography variant="h3" fontFamily="Recoleta-bold">Profile</Typography>
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
                    sx={{ my: 2.5, width: "180px" }}
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
                    sx={{ my: 2.5, width: "180px" }}
                  >
                    Update
                  </LoadingButton>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              {role !== "Admin" && (
                <>
                  <Box>
                    <Typography variant="h3" fontFamily="Recoleta-bold">Manage Funds</Typography>
                  </Box>
                  <Box maxWidth="400px">
                    <TextField
                      sx={{ my: 2.5 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      label="Add or Withdraw money"
                      name="money"
                      onChange={(e) => setMoney(e.target.value)}
                      value={money}
                      error={errorDetails.phone ? true : false}
                      helperText={errorDetails.phone}
                      fullWidth
                      placeholder="Enter Amount"
                    />
                    <Box display="flex" justifyContent="space-around">
                      <LoadingButton
                        variant="outlined"
                        onClick={handleWithdraw}
                        loading={withdrawLoading}
                        loadingPosition="start"
                        size="large"
                        sx={{ my: 2.5, width: "180px" }}
                      >
                        Withdraw
                      </LoadingButton>
                      <LoadingButton
                        variant="contained"
                        onClick={handleAddMoney}
                        loading={addLoading}
                        loadingPosition="start"
                        size="large"
                        sx={{ my: 2.5, width: "180px" }}
                      >
                        Add Money
                      </LoadingButton>
                    </Box>
                  </Box>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
