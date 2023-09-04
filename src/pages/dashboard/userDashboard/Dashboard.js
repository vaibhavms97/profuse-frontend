import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getUserProfileRequest } from "../../../services/authServices";
import {
  getDashboardRequest,
  getProductsListRequest,
} from "../../../services/dashboardServices";
import { format } from "date-fns";
import { toast } from "material-react-toastify";
import Loader from "../../../components/common/Loader";
import Pagination from "../../../components/common/Pagination";
import InvestDialog from "./InvestDialog";

export default function Dashboard() {
  const [userDetails, setUserDetails] = useState({});
  const [accountDetails, setAccountDetails] = useState({});
  const [productDetails, setProductDetails] = useState({});
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [productPage, setProductPage] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    const promises = [
      getUserProfileRequest(),
      getDashboardRequest(),
      getProductsListRequest(1),
    ];
    Promise.all(promises)
      .then((res) => {
        setUserDetails(res[0].data.data.user);
        setAccountDetails(res[1].data.data.accountData);
        setProductsList(res[2].data.data.products.docs);
        setProductDetails(res[2].data.data.products);
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function handlePageChange(pageNo) {
    setIsLoading(true);
    getProductsListRequest(pageNo)
      .then((res) => {
        setProductsList(res.data.data.products.docs);
        setProductDetails(res.data.data.products);
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
        setProductPage(pageNo);
      });
  }

  function handleInvest(product) {
    if (accountDetails.account_balance > 0) {
      setIsInvestDialogOpen(true);
      setSelectedProduct(product);
    } else {
      toast.error("Sorry, you don't have sufficient balance");
    }
  }

  function investmentDone() {
    setIsLoading(true);
    const promises = [
      getUserProfileRequest(),
      getDashboardRequest(),
      getProductsListRequest(productPage),
    ];
    Promise.all(promises)
      .then((res) => {
        setUserDetails(res[0].data.data.user);
        setAccountDetails(res[1].data.data.accountData);
        setProductsList(res[2].data.data.products.docs);
        setProductDetails(res[2].data.data.products);
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      {isLoading && <Loader />}
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
          {productsList.length !== 0 && (
            <TableContainer component={Paper} sx={{ mt: 4 }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "150px" }}>
                      Product Name
                    </TableCell>
                    <TableCell style={{ width: "300px" }} align="center">
                      Product Description
                    </TableCell>
                    <TableCell align="center">Product Amount</TableCell>
                    <TableCell align="center">Product Offering 1</TableCell>
                    <TableCell align="center">Product Offering 2</TableCell>
                    <TableCell align="center">Product Offering 3</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productsList.map((product, index) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.product_name}</TableCell>
                      <TableCell align="center">
                        {product.product_description}
                      </TableCell>
                      <TableCell align="center">
                        ${product.product_amount}
                      </TableCell>
                      <TableCell align="center">{`${product.product_offering1}%  -  ${product.product_offering1_days} days`}</TableCell>
                      <TableCell align="center">
                        {product.product_offering2
                          ? `${product.product_offering2}% - ${product.product_offering2_days} days`
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {product.product_offering3
                          ? `${product.product_offering3}% - ${product.product_offering3_days} days`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleInvest(product)}>
                          Invest
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {!isLoading && (
            <Pagination
              currentPage={productDetails.page}
              totalPages={productDetails.totalPages}
              handlePageChange={handlePageChange}
            />
          )}
        </Box>
        <InvestDialog
          open={isInvestDialogOpen}
          setOpen={setIsInvestDialogOpen}
          product={selectedProduct}
          investmentDone={investmentDone}
        />
      </Box>
    </>
  );
}
