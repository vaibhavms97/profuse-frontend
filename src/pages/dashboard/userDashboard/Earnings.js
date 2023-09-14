import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Pagination from "../../../components/common/Pagination";
import Loader from "../../../components/common/Loader";
import { useEffect, useState } from "react";
import { getAdminEarningsRequest } from "../../../services/adminService";
import { toast } from "material-react-toastify";
import { getUserEarningsRequest } from "../../../services/dashboardServices";
import useWindowResizeHandler from "../../../hooks/useWindowResizeHandler";

export default function Earnings() {
  const [isLoading, setIsLoading] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({});
  const [transactionList, setTransactionList] = useState([]);
  const [productPage, setProductPage] = useState(0);
  const role = localStorage.getItem("role");
  const isValidScreenSize = useWindowResizeHandler();

  useEffect(() => {
    handlePageChange(0);
  }, []);

  function handlePageChange(pageNo) {
    if (role === "Admin") {
      setIsLoading(true);
      getAdminEarningsRequest(pageNo)
        .then((res) => {
          setTransactionList(res.data.data.transactions.docs);
          setTransactionDetails(res.data.data.transactions);
        })
        .catch((err) => {
          toast.error(err.message);
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
          setProductPage(pageNo);
        });
    } else {
      setIsLoading(true);
      getUserEarningsRequest(productPage)
        .then((res) => {
          setTransactionList(res.data.data.transactions.docs);
          setTransactionDetails(res.data.data.transactions);
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
  }

  return (
    <>
      {isLoading && <Loader />}
      <Box pl={isValidScreenSize ? "240px" : "80px"}>
        <Box m={4}>
        <Typography variant="h3" fontFamily="Recoleta-bold">{role === "Admin" ? "Admin" : "Your"} Earnings</Typography>
          {transactionList.length !== 0 && (
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
                    <TableCell align="center">Amount Invested</TableCell>
                    <TableCell align="center">Earnings</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactionList.map((transaction, index) => (
                    <TableRow key={transaction._id}>
                      <TableCell>
                        {transaction.product_id?.product_name}
                      </TableCell>
                      <TableCell align="center">
                        {transaction.product_id?.product_description}
                      </TableCell>
                      <TableCell align="center">
                        ${transaction.amount}
                      </TableCell>
                      <TableCell align="center">
                        {role === "Admin"
                          ? transaction?.admin_earnings || 0
                          : transaction.user_earnings || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {transactionList.length === 0 && (
            <Typography mt={1}>Sorry don't have any earnings</Typography>
          )}
          {!isLoading && (
            <Pagination
              currentPage={transactionDetails.page}
              totalPages={transactionDetails.totalPages}
              handlePageChange={handlePageChange}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
