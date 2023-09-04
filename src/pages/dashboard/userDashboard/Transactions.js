import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { toast } from "material-react-toastify";
import { useEffect, useState } from "react";
import Loader from "../../../components/common/Loader";
import Pagination from "../../../components/common/Pagination";
import { getTransactionsRequest } from "../../../services/dashboardServices";
import { format } from "date-fns";
import WithdrawDialog from "./WithdrawDialog";

export default function Transactions() {
  const [transactionDetails, setTransactionDetails] = useState({});
  const [transactionList, setTransactionList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [selectedWithdrawId, setSelectedWithdrawId] = useState();

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

  function handleWithdraw(id) {
    setSelectedWithdrawId(id);
    setIsWithdrawDialogOpen(true);
  }

  return (
    <>
      {isLoading && <Loader />}
      <Box pl="240px">
        <Box m={4}>
          <Typography variant="h4">Your Transactions</Typography>
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
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">End Date</TableCell>
                    <TableCell align="center">Action</TableCell>
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
                      <TableCell align="center">
                        <Typography
                          color={
                            transaction.status === "Pending"
                              ? "#ecb532"
                              : "#148951"
                          }
                          bgcolor={
                            transaction.status === "Pending"
                              ? "#ecb5321a"
                              : "#1489511a"
                          }
                          py={0.5}
                          borderRadius="0.5rem"
                          fontWeight="500"
                        >
                          {transaction?.status || "Pending"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {format(new Date(transaction?.ends_at), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell align="center">
                        {transaction.status === "Pending" ? (
                          <Button
                            onClick={() => handleWithdraw(transaction._id)}
                          >
                            Withdraw
                          </Button>
                        ) : (
                          ""
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {transactionList.length === 0 && (
            <Typography mt={1}>
              Sorry you don't have any transactions
            </Typography>
          )}
          {!isLoading && (
            <Pagination
              currentPage={transactionDetails.page}
              totalPages={transactionDetails.totalPages}
              handlePageChange={handlePageChange}
            />
          )}
        </Box>
        <WithdrawDialog
          open={isWithdrawDialogOpen}
          setOpen={setIsWithdrawDialogOpen}
          selectedWithdrawId={selectedWithdrawId}
          setSelectedWithdrawId={setSelectedWithdrawId}
        />
      </Box>
    </>
  );
}
