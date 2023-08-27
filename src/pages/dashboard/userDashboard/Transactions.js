import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { toast } from "material-react-toastify";
import { useEffect, useState } from "react";
import Loader from "../../../components/common/Loader";
import Pagination from "../../../components/common/Pagination";
import { getTransactionsRequest } from "../../../services/dashboardServices";

export default function Transactions() {
  const [transactionDetails, setTransactionDetails] = useState({});
  const [transactionList, setTransactionList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getTransactionsRequest()
      .then((res) => {
        setTransactionDetails(res.data.data.transactions);
        setTransactionList(res.data.data.transactions.docs);
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
    getTransactionsRequest(pageNo)
      .then((res) => {
        setTransactionDetails(res.data.data.transactions);
        setTransactionList(res.data.data.transactions.docs);
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
                    <TableCell align="center">Product Offering</TableCell>
                    {/* <TableCell align="center">Action</TableCell> */}
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
                      <TableCell align="center">{`${transaction?.invest_percent}%  -  ${transaction?.no_of_days} days`}</TableCell>
                      {/* <TableCell>
                        <Button onClick={() => handleInvest(product)}>Invest</Button>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
