import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import { getUserProfileRequest } from "../../../services/authServices";
import { getDashboardRequest } from "../../../services/dashboardServices";
import { format } from "date-fns";
import { toast } from "material-react-toastify";
import Loader from "../../../components/common/Loader";

export default function Dashboard() {
  const [userDetails, setUserDetails] = useState({});
  const [accountDetails, setAccountDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const promises = [getUserProfileRequest(), getDashboardRequest()];
    Promise.all(promises)
      .then((res) => {
        setUserDetails(res[0].data.data.user);
        setAccountDetails(res[1].data.data.accountData);
        console.log(res);
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // getUserProfileRequest().then((res) => {
    //   setUserDetails(res.data.data.user);
    // });
    // getDashboardRequest().then((res) => {
    //   setAccountDetails(res.data.data.accountData)
    // });
  }, []);

  return (
    <>
      {isLoading && <Loader/>}
      <Box pl="240px">
        <Box m={4}>
          <Box>
            <Typography variant="h4">Dashboard</Typography>
            <Typography pt={1}>
              Hi, {userDetails.name}. Start managing your finances.
            </Typography>
          </Box>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={3}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  Availabe funds
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    columnGap={3}
                  >
                    <Typography variant="h4" mt={4}>
                      ${accountDetails.account_balance}
                    </Typography>
                    <Typography textAlign="end">
                      Updated On {format(new Date(), "MMM dd, yyyy")}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              <Card
                variant="outlined"
                sx={{
                  background: "#4848e9",
                  color: "#fff",
                }}
              >
                <CardContent>
                  Invested
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    columnGap={3}
                  >
                    <Typography variant="h4" mt={4}>
                      ${accountDetails.vested_balance}
                    </Typography>
                    <Typography textAlign="end">
                      Updated On {format(new Date(), "MMM dd, yyyy")}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}></Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
