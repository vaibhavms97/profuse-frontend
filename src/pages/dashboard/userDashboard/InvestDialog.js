import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import LoadingButton from '@mui/lab/LoadingButton';
import { investAmountRequest } from "../../../services/adminService";
import { toast } from "material-react-toastify";

export default function InvestDialog({open, setOpen, product, investmentDone}) {

  const [investedDetails, setInvestedDetails] = useState({
    product_offering: 1,
    product_amount: "",
  });
  const [errorDetails, setErrorDetails] = useState({
    product_amount: "",
  });
  const [selectedPercentage, setSelectedPercentage] = useState(product.product_offering1);
  const [selectedDays, setSelectedDays] = useState(product.product_offering1_days);
  const [isLoading, setIsLoading] = useState(false);


  function handleClose() {
    setOpen(false);
    setInvestedDetails({
      product_offering: 1,
      product_amount: "",
    })
    setErrorDetails({
      product_amount: "",
    })
    setSelectedPercentage(product.product_offering1)
    setSelectedDays(product.product_offering1_days)
  }

  function handleChange(e) {
    setInvestedDetails(prev => ({...prev, [e.target.name]: e.target.value}));
    if(e.target.name === "product_offering") {
      if(e.target.value === 1) {
        setSelectedPercentage(product.product_offering1)
        setSelectedDays(product.product_offering1_days)
      } else if(e.target.value === 2) {
        setSelectedPercentage(product.product_offering2)
        setSelectedDays(product.product_offering2_days)
      } else if(e.target.value === 3) {
        setSelectedPercentage(product.product_offering3)
        setSelectedDays(product.product_offering3_days)
      }
    }
  }

  function handleInvest() {
    if(!investedDetails.product_amount) {
      setErrorDetails({product_amount: "Please enter product amount"});
    } else {
      setErrorDetails({product_amount: ""});
      const date = new Date();
      date.setDate(date.getDate() + Number(selectedDays));
      const data = {
        invest_amount: investedDetails.product_amount,
        invest_percent: selectedPercentage,
        no_of_days: selectedDays,
        product_id: product._id,
        ends_at: date,
      }
      setIsLoading(true);
      investAmountRequest(data)
      .then(res => {
        if(res.data.status === 200) {
          investmentDone();
          toast.success("Invested successfully")
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
        handleClose();
      })
    }
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ my: 1 }}
          label="Product Name"
          name="product_name"
          value={product.product_name}
          fullWidth
          disabled
        />
        <TextField
          sx={{ my: 1 }}
          label="Product Description"
          name="product_description"
          value={product.product_description}
          fullWidth
          disabled
        />
        <TextField
          sx={{ my: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end" sx={{width:"300px", justifyContent:"end"}}>{`upto $${product.product_amount}`}</InputAdornment>            
          }}
          label="Product Amount"
          name="product_amount"
          value={investedDetails.product_amount}
          onChange={handleChange}
          error = {errorDetails.product_amount ? true : false}
          helperText = {errorDetails.product_amount}
          fullWidth
          required
        />
        <FormControl fullWidth sx={{ my: 1 }} required>
          <InputLabel>Product Offering</InputLabel>
          <Select
            name="product_offering"
            value={investedDetails.product_offering}
            label="Product Offering"
            onChange={handleChange}
          >
            <MenuItem value={1}>{`${product.product_offering1}%  -  ${product.product_offering1_days} days`}</MenuItem>
            {product.product_offering2 ? <MenuItem value={2}>{`${product.product_offering2}% - ${product.product_offering2_days} days`}</MenuItem> : ""}
            {product.product_offering3 ? <MenuItem value={3}>{`${product.product_offering3}% - ${product.product_offering3_days} days`}</MenuItem> : ""}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" size="large" sx={{ mb: 2.5, mr: 2 }} onClick={handleClose}>Cancel</Button>
        {/* <Button variant="contained" sx={{ mb: 2.5, mr: 2 }} onClick={handleInvest}>Invest</Button> */}
        <LoadingButton
          loading = {isLoading}
          loadingPosition="start"
          variant="contained"
          sx={{ mb: 2.5, mr: 2, width: "150px" }}
          size="large"
          onClick={handleInvest}
        >
          Invest
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}