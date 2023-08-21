import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { useState } from 'react';
import { editProductRequest } from '../../../services/adminService';
import { toast } from 'material-react-toastify';

export default function EditProductDialog({open, setOpen, selectedProduct, setSelectedProduct, handleUpdate}){

  const [errorDetails, setErrorDetails] = useState({
    product_name:"",
    product_description:"",
    product_offering1:"",
    product_offering1_days:"",
    product_offering2:"",
    product_offering2_days:"",
    product_offering3:"",
    product_offering3_days:"",
    product_amount:""
  });

  const [isLoading, setIsLoading] = useState(false);

  function handleClose() {
    setOpen(false);
  }

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setSelectedProduct((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditProduct(){
    let error = {
      product_name:"",
      product_description:"",
      product_offering1:"",
      product_offering1_days:"",
      product_offering2:"",
      product_offering2_days:"",
      product_offering3:"",
      product_offering3_days:"",
      product_amount:""
    }
    let isError = false
    if (!selectedProduct.product_name) {
      error.product_name = "Please enter product name"
      isError = true;
    } 
    if(!selectedProduct.product_description) {
      error.product_description = "Please enter product description"
      isError = true;
    } 
    if(!selectedProduct.product_offering1) {
      error.product_offering1 = "Atleast one product offering should be entered"
      isError = true;
    } 
    if(!selectedProduct.product_offering1_days) {
      error.product_offering1_days = "Please enter days"
      isError = true;
    } 
    if(!selectedProduct.product_offering2 && selectedProduct.product_offering2_days) {
        error.product_offering2 = "Please enter product offering 2"
        isError = true;
    } else if(selectedProduct.product_offering2 && !selectedProduct.product_offering2_days) {
      error.product_offering2_days = "Please enter product offering 2 days"
      isError = true;
    }
    if(!selectedProduct.product_offering3 && selectedProduct.product_offering3_days) {
      error.product_offering3 = "Please enter product offering 3"
      isError = true;
    } else if(selectedProduct.productOffering3 && !selectedProduct.product_offering3_days) {
      error.product_offering3_days = "Please enter product offering 3 days"
      isError = true;
    }
    if(!selectedProduct.product_amount) {
      error.product_amount = "Please enter product amount"
    }

    if(isError){
      setErrorDetails(error);
    } else {
      setIsLoading(true);
      setErrorDetails(error);
      const data = {
        product_name: selectedProduct.product_name,
        product_description: selectedProduct.product_description,
        product_offering1: selectedProduct.product_offering1,
        product_offering2: selectedProduct.product_offering2,
        product_offering3: selectedProduct.product_offering3,
        product_offering1_days: selectedProduct.product_offering1_days,
        product_offering2_days: selectedProduct.product_offering2_days,
        product_offering3_days: selectedProduct.product_offering3_days,
        product_amount: selectedProduct.product_amount,
        _id: selectedProduct._id,
      }
      editProductRequest(data)
      .then(res => {
        if(res.data.status === 200){
          toast.success("Product updated successfully");
          handleUpdate();
          handleClose();
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
      })
    }

  }

  return(
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ my: 1 }}
          label="Product Name"
          name="product_name"
          onChange={handleChange}
          value={selectedProduct.product_name}
          error={errorDetails.product_name ? true : false}
          helperText={errorDetails.product_name}
          fullWidth
          required
          placeholder="Enter product name"
        />
        <TextField
          sx={{ my: 1 }}
          label="Product Description"
          name="product_description"
          onChange={handleChange}
          value={selectedProduct.product_description}
          error={errorDetails.product_description ? true : false}
          helperText={errorDetails.product_description}
          fullWidth
          required
          placeholder="Enter product description"
        />
        <Box display="flex" alignItems="center">
          <TextField
            sx={{ my: 1, maxWidth:"100px" }}
            label="Product Offering 1"
            name="product_offering1"
            onChange={handleChange}
            value={selectedProduct.product_offering1}
            error={errorDetails.product_offering1 ? true : false}
            helperText={errorDetails.product_offering1}
            fullWidth
            required
            placeholder="Enter product offering 1"
          />
          <TextField
            sx={{ my: 1, ml: 1.5}}
            label="Product Offering 1 Days"
            name="product_offering1_days"
            onChange={handleChange}
            value={selectedProduct.product_offering1_days}
            error={errorDetails.product_offering1_days ? true : false}
            helperText={errorDetails.product_offering1_days}
            fullWidth
            required
            placeholder="Enter product offering 1 days"
          />
        </Box>
        <Box display="flex" alignItems="center">
          <TextField
            sx={{ my: 1, maxWidth:"100px" }}
            label="Product Offering 2"
            name="product_offering2"
            onChange={handleChange}
            value={selectedProduct.product_offering2}
            error={errorDetails.product_offering2 ? true : false}
            helperText={errorDetails.product_offering2}
            fullWidth
            placeholder="Enter product offering 2"
          />
          <TextField
            sx={{ my: 1, ml: 1.5}}
            label="Product Offering 2 Days"
            name="product_offering2_days"
            onChange={handleChange}
            value={selectedProduct.product_offering2_days}
            error={errorDetails.product_offering2_days ? true : false}
            helperText={errorDetails.product_offering2_days}
            fullWidth
            placeholder="Enter product offering 2 days"
          />
        </Box>
        <Box display="flex" alignItems="center">
          <TextField
            sx={{ my: 1, maxWidth:"100px" }}
            label="Product Offering 3"
            name="product_offering3"
            onChange={handleChange}
            value={selectedProduct.product_offering3}
            error={errorDetails.product_offering3 ? true : false}
            helperText={errorDetails.product_offering3}
            fullWidth
            placeholder="Enter product offering 3"
          />
          <TextField
            sx={{ my: 1, ml: 1.5}}
            label="Product Offering 3 Days"
            name="product_offering3_days"
            onChange={handleChange}
            value={selectedProduct.product_offering3_days}
            error={errorDetails.product_offering3_days ? true : false}
            helperText={errorDetails.product_offering3_days}
            fullWidth
            placeholder="Enter product offering 3 days"
          />
        </Box>
        <TextField
          sx={{ my: 1 }}
          label="Product Amount"
          name="product_amount"
          onChange={handleChange}
          value={selectedProduct.product_amount}
          error={errorDetails.product_amount ? true : false}
          helperText={errorDetails.product_amount}
          fullWidth
          required
          placeholder="Enter product amount"
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          size="large"
          sx={{ mb: 2.5, mr: 2 }}
          onClick={handleClose}
        >
          Cancel
        </Button>
        <LoadingButton
          loading = {isLoading}
          loadingPosition="start"
          variant="contained"
          sx={{ mb: 2.5, mr: 2 }}
          size="large"
          onClick={handleEditProduct}
        >
          Edit Product
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}