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
  TextField,
  InputAdornment,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getUserProfileRequest } from "../../../services/authServices";
import {
  getDashboardRequest,
  getMonthlyEarningsRequest,
  getProductsListRequest,
} from "../../../services/dashboardServices";
import { format } from "date-fns";
import { toast } from "material-react-toastify";
import Loader from "../../../components/common/Loader";
import Pagination from "../../../components/common/Pagination";
import InvestDialog from "./InvestDialog";
import InvestLogo from "../../../assets/images/invest.svg";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { investAmountRequest } from "../../../services/adminService";
import useWindowResizeHandler from "../../../hooks/useWindowResizeHandler";


export default function Dashboard() {
  const [userDetails, setUserDetails] = useState({name: ""});
  const [accountDetails, setAccountDetails] = useState({vested_balance: 0, account_balance: 0});
  const [productDetails, setProductDetails] = useState({});
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [selectedOffering, setSelectedOffering] = useState();
  const [productPage, setProductPage] = useState(0);
  const [amountToInvest, setAmountToInvest] = useState("");
  const [errorDetails, setErrorDetails] = useState({ amountToInvest: "" });
  const [chartData, setChartData] = useState({
    labels: ["Earnings", "Invested"],
    datasets: [
      {
        label: "Amount",
        data: [],
        backgroundColor: ["#4848e9", "#d1d5db"]
      },
    ],
  });
  const isValidScreenSize = useWindowResizeHandler();

  ChartJS.register(ArcElement, Tooltip, Legend);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Earnings",
      },
    },
  };

  const plugins = [
    {
      afterDraw: function (chart) {
        console.log("chartData", chart)
        if (chart.data.datasets[0].data.length < 1) {
          let ctx = chart.ctx;
          let width = chart.width;
          let height = chart.height;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "30px Arial";
          ctx.fillText("No data to display", width / 2, height / 2);
          ctx.restore();
        }
      },
    },
  ];

  useEffect(() => {
    const month = new Date().getMonth();
    setIsLoading(true);
    const promises = [
      getUserProfileRequest(),
      getDashboardRequest(),
      getProductsListRequest(1),
      getMonthlyEarningsRequest({ from: month - 5, to: month }),
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

  useEffect(() => {
    if(accountDetails?.total_earnings || accountDetails?.total_invested) {
      const data = {
        labels: ["Earnings", "Invested"],
        datasets: [
          {
            label: "Amount",
            data: [accountDetails?.total_earnings, accountDetails?.total_invested],
            backgroundColor: ["#4848e9", "#d1d5db"]
          }
        ]
      }
      setChartData(data)
    }
  }, [accountDetails])

  useEffect(() => {
    if (selectedProduct?.product_name) {
      setSelectedOffering(1);
    }
  }, [selectedProduct]);

  function handlePageChange(pageNo) {
    setIsLoading(true);
    getProductsListRequest(pageNo)
      .then((res) => {
        setProductsList(res.data.data.products.docs);
        setProductDetails(res.data.data.products);
        setSelectedProduct({});
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
      // Old version
      // setIsInvestDialogOpen(true);
      // setSelectedProduct(product);
      checkValidations();
    } else {
      toast.error("Sorry, you don't have sufficient balance");
    }
    // navigate(`invest/${product._id}`)
  }

  function checkValidations() {
    if (!amountToInvest) {
      setErrorDetails({ amountToInvest: "Please enter amount" });
    } else if (amountToInvest <= 0) {
      setErrorDetails({ amountToInvest: "Please enter a valid amount" });
    } else if (amountToInvest > selectedProduct.product_amount) {
      setErrorDetails({
        amountToInvest: `Sorry you can't invest more than ${selectedProduct.product_amount}`,
      });
    } else {
      setErrorDetails({ product_amount: "" });
      const date = new Date();
      let selectedPercentage;
      let selectedDays;
      if (selectedOffering === 1) {
        selectedPercentage = selectedProduct.product_offering1;
        selectedDays = selectedProduct.product_offering1_days;
      } else if (selectedOffering === 2) {
        selectedPercentage = selectedProduct.product_offering2;
        selectedDays = selectedProduct.product_offering2_days;
      } else if (selectedOffering === 3) {
        selectedPercentage = selectedProduct.product_offering3;
        selectedDays = selectedProduct.product_offering3_days;
      }
      date.setDate(date.getDate() + Number(selectedDays));
      const data = {
        invest_amount: amountToInvest,
        invest_percent: selectedPercentage,
        no_of_days: selectedDays,
        product_id: selectedProduct._id,
        ends_at: date,
      };
      setIsLoading(true);
      investAmountRequest(data)
        .then((res) => {
          if (res.data.status === 200) {
            investmentDone();
            toast.success("Invested successfully");
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
      <Box pl={isValidScreenSize ? "240px" : "80px"}>
        <Box m={4}>
          <Box>
            <Typography variant="h3" fontFamily="Recoleta-bold">Dashboard</Typography>
          </Box>
          <Grid container rowSpacing={2} columnSpacing={10} mt={2}>
            <Grid item xs={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      height="150px"
                      bgcolor="#f28626"
                      pl={4}
                      pt={2}
                    >
                      <Box>
                        <Typography color="#fff">Welcome back 👋</Typography>
                        <Typography color="#fff" variant="h4" fontFamily="Recoleta-bold">
                          {userDetails?.name[0]?.toUpperCase()+userDetails?.name?.split(" ")[0].substring(1)}
                        </Typography>
                      </Box>
                      <Box>
                        <img
                          src={InvestLogo}
                          alt="invest"
                          height="130px"
                          style={{ marginRight: "20px",marginTop:"10px" }}
                        />
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      Availabe funds
                      <Typography variant="h4" mt={3}>
                        ${Math.round((accountDetails.account_balance + Number.EPSILON)*100)/100}
                      </Typography>
                      <Typography variant="caption">
                        Updated On {format(new Date(), "MMM dd, yyyy")}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    variant="outlined"
                    sx={{
                      background: "#4848e9",
                      color: "#fff",
                    }}
                  >
                    <CardContent>
                      Invested
                      <Typography variant="h4" mt={3}>
                        ${Math.round((accountDetails.vested_balance + Number.EPSILON)*100)/100}
                      </Typography>
                      <Typography variant="caption">
                        Updated On {format(new Date(), "MMM dd, yyyy")}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} maxHeight="326px" justifyContent="center" display="flex">
              <Doughnut options={options} data={chartData} plugins={plugins} />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={4}>
            <Grid
              item
              xs={selectedProduct.product_name ? 7 : 12}
            >
              {productsList.length !== 0 && (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: "150px" }}>
                          Product Name
                        </TableCell>
                        <TableCell align="center" style={{ width: "300px" }}>
                          Product Description
                        </TableCell>
                        <TableCell align="center">Avaible Funds</TableCell>
                        {/* <TableCell align="center">Product Offering 1</TableCell>
                            <TableCell align="center">Product Offering 2</TableCell>
                            <TableCell align="center">Product Offering 3</TableCell>
                            <TableCell align="center">Action</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productsList.map((product, index) => (
                        <TableRow
                          key={product._id}
                          onClick={() => {
                            setSelectedProduct(product);
                          }}
                          sx={{
                            "&:hover": {
                              background: "#6366f1",
                              cursor: "pointer",
                            },
                            "&:hover .MuiTableCell-root, &:hover .MuiTableCell-root span.material-icons-outlined":
                              {
                                color: "#fff",
                              },
                          }}
                        >
                          <TableCell>{product.product_name}</TableCell>
                          <TableCell align="center" >
                            <Box display="flex" justifyContent="center">
                              <Typography sx={{maxWidth:"300px"}} textAlign="center" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                {product.product_description}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            ${product.product_amount}
                          </TableCell>
                          {/* <TableCell align="center">{`${product.product_offering1}%  -  ${product.product_offering1_days} days`}</TableCell>
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
                      </TableCell> */}
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
            </Grid>
            {selectedProduct.product_name && (
              <Grid item xs={5} sx={{ transition: "all 0.5s" }}>
                <Box>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Box>
                      <Typography variant="h6" textAlign="center">
                        {selectedProduct.product_name}
                      </Typography>
                    </Box>
                    <img
                      src={selectedProduct?.product_image}
                      style={{
                        height: "100px",
                        width: "100%",
                        objectFit: "contain",
                        marginTop: "2rem",
                      }}
                      alt="product_image"
                    />
                    {/* <Grid container pt={5}>
                      <Grid item xs={4}>
                        <Typography fontWeight="bold">Product name:</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography>{selectedProduct.product_name}</Typography>
                      </Grid>
                    </Grid> */}
                    <Grid container pt={4}>
                      {/* <Grid item xs={4}>
                        <Typography fontWeight="bold">
                          Product description:
                        </Typography>
                      </Grid> */}
                      <Grid item xs={12}>
                        <Typography textAlign="center">
                          {selectedProduct.product_description}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container alignItems="center" pt={1}>
                      <Grid item xs={4}>
                        <Typography fontWeight="bold">Amount:</Typography>
                      </Grid>
                      <Grid xs={8}>
                        <TextField
                          sx={{ my: 1 }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment
                                position="end"
                                sx={{ width: "300px", justifyContent: "end" }}
                              >{`upto $${selectedProduct.product_amount}`}</InputAdornment>
                            ),
                          }}
                          name="product_amount"
                          value={amountToInvest}
                          onChange={(e) => setAmountToInvest(e.target.value)}
                          error={errorDetails.amountToInvest ? true : false}
                          helperText={errorDetails.amountToInvest}
                          fullWidth
                          required
                        />
                      </Grid>
                    </Grid>
                    <Box display="flex" justifyContent="space-around" pt={2}>
                      <Card
                        variant="outlined"
                        sx={{
                          p: 1,
                          background: selectedOffering === 1 ? "#4848e9" : "",
                          color: selectedOffering === 1 ? "#fff" : "",
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedOffering(1)}
                      >
                        <Typography fontWeight="bold" textAlign="center">
                          Offering 1
                        </Typography>
                        <Typography textAlign="center">{`${selectedProduct.product_offering1}%  -  ${selectedProduct.product_offering1_days} days`}</Typography>
                      </Card>
                      {selectedProduct.product_offering2 && (
                        <Card
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            background: selectedOffering === 2 ? "#4848e9" : "",
                            color: selectedOffering === 2 ? "#fff" : "",
                            cursor: "pointer",
                          }}
                          onClick={() => setSelectedOffering(2)}
                        >
                          <Typography fontWeight="bold" textAlign="center">
                            Offering 2
                          </Typography>
                          <Typography textAlign="center">{`${selectedProduct.product_offering2}%  -  ${selectedProduct.product_offering2_days} days`}</Typography>
                        </Card>
                      )}
                      {selectedProduct.product_offering3 && (
                        <Card
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            background: selectedOffering === 3 ? "#4848e9" : "",
                            color: selectedOffering === 3 ? "#fff" : "",
                            cursor: "pointer",
                          }}
                          onClick={() => setSelectedOffering(3)}
                        >
                          <Typography fontWeight="bold" textAlign="center">
                            Offering 3
                          </Typography>
                          <Typography textAlign="center">{`${selectedProduct.product_offering3}%  -  ${selectedProduct.product_offering3_days} days`}</Typography>
                        </Card>
                      )}
                    </Box>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{ my: 2 }}
                      onClick={handleInvest}
                    >
                      Invest
                    </Button>
                  </Card>
                  {/* {selectedProduct.product_name} */}
                </Box>
              </Grid>
            )}
          </Grid>
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
