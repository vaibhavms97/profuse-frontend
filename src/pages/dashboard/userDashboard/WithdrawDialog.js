import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "material-react-toastify";
import { Typography } from "@mui/material";
import { withdrawTransactionRequest } from "../../../services/dashboardServices";

export default function WithdrawDialog({
  open,
  setOpen,
  selectedWithdrawId,
  setSelectedWithdrawId,
  withdrawSuccessfull
}) {
  const [isLoading, setIsLoading] = useState(false);

  function handleClose() {
    setOpen(false);
    setSelectedWithdrawId("");
  }

  function handleWithdraw() {
    const data = {
      transaction_id: selectedWithdrawId,
    };
    setIsLoading(true);
    withdrawTransactionRequest(data)
      .then((res) => {
        if (res.data.status === 200) {
          toast.success("Amount withdrawn successfully");
          withdrawSuccessfull();
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
        handleClose();
      });
  }

  return (
    <Dialog
      PaperProps={{ style: { width: "600px" } }}
      onClose={handleClose}
      open={open}
    >
      <DialogTitle>Withdraw Confirmation</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure do you want to withdraw Confirmation
        </Typography>
        <Typography>
          If you withdraw you will get only 2% from the profit
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          sx={{ mb: 2.5, mr: 2 }}
          onClick={handleClose}
        >
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          sx={{ mb: 2.5, mr: 2, width: "150px" }}
          onClick={handleWithdraw}
          loading={isLoading}
        >
          Withdraw
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
