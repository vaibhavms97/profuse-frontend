import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { useState } from 'react';
import { addProductRequest } from '../../../services/adminService';
import { toast } from 'material-react-toastify';
import { InputAdornment, Typography } from '@mui/material';

export default function AddProductDialog({open, setOpen, productsList, setProductsList}){

  const [productDetails, setProductDetails] = useState({
    productName:"",
    productDescription:"",
    productOffering1:"",
    productOffering1Days:"",
    productOffering2:"",
    productOffering2Days:"",
    productOffering3:"",
    productOffering3Days:"",
    productAmount:"",
    productImage:"",
  });
  const [errorDetails, setErrorDetails] = useState({
    productName:"",
    productDescription:"",
    productOffering1:"",
    productOffering1Days:"",
    productOffering2:"",
    productOffering2Days:"",
    productOffering3:"",
    productOffering3Days:"",
    productAmount:"",
    productImage:"",
  });

  const [isLoading, setIsLoading] = useState(false);

  function handleClose() {
    setOpen(false);
  }

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setProductDetails((prev) => ({ ...prev, [name]: value }));
  }

  function handleAddProduct(){
    let error = {
      productName:"",
      productDescription:"",
      productOffering1:"",
      productOffering1Days:"",
      productOffering2:"",
      productOffering2Days:"",
      productOffering3:"",
      productOffering3Days:"",
      productAmount:"",
      productImage:"",
    }
    let isError = false
    if (!productDetails.productName) {
      error.productName = "Please enter product name"
      isError = true;
    } 
    if(!productDetails.productDescription) {
      error.productDescription = "Please enter product description"
      isError = true;
    } 
    if(!productDetails.productOffering1) {
      error.productOffering1 = "Atleast one product offering should be entered"
      isError = true;
    } 
    if(!productDetails.productOffering1Days) {
      error.productOffering1Days = "Please enter days"
      isError = true;
    } 
    if(!productDetails.productOffering2 && productDetails.productOffering2Days) {
        error.productOffering2 = "Please enter product offering 2"
        isError = true;
    } else if(productDetails.productOffering2 && !productDetails.productOffering2Days) {
      error.productOffering2Days = "Please enter product offering 2 days"
      isError = true;
    }
    if(!productDetails.productOffering3 && productDetails.productOffering3Days) {
      error.productOffering3 = "Please enter product offering 3"
      isError = true;
    } else if(productDetails.productOffering3 && !productDetails.productOffering3Days) {
      error.productOffering3Days = "Please enter product offering 3 days"
      isError = true;
    }
    if(!productDetails.productAmount) {
      error.productAmount = "Please enter product amount"
    }
    if(!productDetails.productImage) {
      error.productImage = "Please upload image"
    }

    if(isError){
      setErrorDetails(error);
    } else {
      // setIsLoading(true);
      setErrorDetails(error);
      // const formData = new FormData();
      // formData.append("product_image", productDetails.productImage)

      // formData.append(
      //   "request",
      //   `{"data": {
      //     "product_name": "${productDetails.productName}",
      //     "product_description": "${productDetails.productDescription}",
      //     "product_offering1": "${productDetails.productOffering1}",
      //     "product_offering2": "${productDetails.productOffering2}",
      //     "product_offering3": "${productDetails.productOffering3}",
      //     "product_offering1_days": "${productDetails.productOffering1Days}",
      //     "product_offering2_days": "${productDetails.productOffering2Days}",
      //     "product_offering3_days": "${productDetails.productOffering3Days}",
      //     "product_amount": "${productDetails.productAmount}"
      //   }}`
      // )
      const data = {
        product_name: productDetails.productName,
        product_description: productDetails.productDescription,
        product_offering1: productDetails.productOffering1,
        product_offering2: productDetails.productOffering2,
        product_offering3: productDetails.productOffering3,
        product_offering1_days: productDetails.productOffering1Days,
        product_offering2_days: productDetails.productOffering2Days,
        product_offering3_days: productDetails.productOffering3Days,
        product_amount: productDetails.productAmount,
        product_image: productDetails.productImage,
      }
      // addProductRequest(data)
      // .then(res => {
      //   if(res.data.status === 201){
      //     toast.success("Product added successfully");
      //     const modifiedProductList = [...productsList];
      //     data._id = res.data.data.product._id;
      //     modifiedProductList.unshift(data);
      //     setProductsList([...modifiedProductList])
      //     setProductDetails({
      //       productName:"",
      //       productDescription:"",
      //       productOffering1:"",
      //       productOffering1Days:"",
      //       productOffering2:"",
      //       productOffering2Days:"",
      //       productOffering3:"",
      //       productOffering3Days:"",
      //       productAmount:"",
      //       productImage:"",
      //     })
      //     handleClose();
      //   } else {
      //     toast.error(res.data.message)
      //   }
      // })
      // .catch(err => {
      //   console.log(err);
      //   toast.error(err.message);
      // })
      // .finally(() => {
      //   setIsLoading(false);
      // })
    }

  }

  function handleUploadImage(event) {
    if(event.target.files.length) {
      const fileSize = Math.round(event.target.files[0].size/1024);
      if(fileSize/1024 > 2){
        toast.error="File size should not exceed more than 2mb"
      } else {
        const selectedFile = event.target.files[0];
        convertToBase64(selectedFile)
        .then(res => {
          console.log(res);
          setProductDetails(prev => ({...prev, productImage: res}))          
        })
      }
    }
  }

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader(); 
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      }
    })
  }

  return(
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ my: 1 }}
          label="Product Name"
          name="productName"
          onChange={handleChange}
          value={productDetails.productName}
          error={errorDetails.productName ? true : false}
          helperText={errorDetails.productName}
          fullWidth
          required
          placeholder="Enter product name"
        />
        <TextField
          sx={{ my: 1 }}
          label="Product Description"
          name="productDescription"
          onChange={handleChange}
          value={productDetails.productDescription}
          error={errorDetails.productDescription ? true : false}
          helperText={errorDetails.productDescription}
          fullWidth
          required
          placeholder="Enter product description"
        />
        <Box display="flex" alignItems="center">
          <TextField
            sx={{ my: 1, maxWidth:"100px" }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>
            }}
            label="Product Offering 1"
            name="productOffering1"
            onChange={handleChange}
            value={productDetails.productOffering1}
            error={errorDetails.productOffering1 ? true : false}
            helperText={errorDetails.productOffering1}
            fullWidth
            required
            placeholder="Enter product offering 1"
          />
          <TextField
            sx={{ my: 1, ml: 1.5}}
            InputProps={{
              endAdornment: <InputAdornment position="end">days</InputAdornment>
            }}
            label="Product Offering 1 Days"
            name="productOffering1Days"
            onChange={handleChange}
            value={productDetails.productOffering1Days}
            error={errorDetails.productOffering1Days ? true : false}
            helperText={errorDetails.productOffering1Days}
            fullWidth
            required
            placeholder="Enter product offering 1 days"
          />
        </Box>
        <Box display="flex" alignItems="center">
          <TextField
            sx={{ my: 1, maxWidth:"100px" }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>
            }}
            label="Product Offering 2"
            name="productOffering2"
            onChange={handleChange}
            value={productDetails.productOffering2}
            error={errorDetails.productOffering2 ? true : false}
            helperText={errorDetails.productOffering2}
            fullWidth
            placeholder="Enter product offering 2"
          />
          <TextField
            sx={{ my: 1, ml: 1.5}}
            InputProps={{
              endAdornment: <InputAdornment position="end">days</InputAdornment>
            }}
            label="Product Offering 2 Days"
            name="productOffering2Days"
            onChange={handleChange}
            value={productDetails.productOffering2Days}
            error={errorDetails.productOffering2Days ? true : false}
            helperText={errorDetails.productOffering2Days}
            fullWidth
            placeholder="Enter product offering 2 days"
          />
        </Box>
        <Box display="flex" alignItems="center">
          <TextField
            sx={{ my: 1, maxWidth:"100px" }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>
            }}
            label="Product Offering 3"
            name="productOffering3"
            onChange={handleChange}
            value={productDetails.productOffering3}
            error={errorDetails.productOffering3 ? true : false}
            helperText={errorDetails.productOffering3}
            fullWidth
            placeholder="Enter product offering 3"
          />
          <TextField
            sx={{ my: 1, ml: 1.5}}
            InputProps={{
              endAdornment: <InputAdornment position="end">days</InputAdornment>
            }}
            label="Product Offering 3 Days"
            name="productOffering3Days"
            onChange={handleChange}
            value={productDetails.productOffering3Days}
            error={errorDetails.productOffering3Days ? true : false}
            helperText={errorDetails.productOffering3Days}
            fullWidth
            placeholder="Enter product offering 3 days"
          />
        </Box>
        <TextField
          sx={{ my: 1 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>
          }}
          label="Product Amount"
          name="productAmount"
          onChange={handleChange}
          value={productDetails.productAmount}
          error={errorDetails.productAmount ? true : false}
          helperText={errorDetails.productAmount}
          fullWidth
          required
          placeholder="Enter product amount"
        />
        <Box display="flex" justifyContent="center" flexDirection="column">
          <Button variant='contained' size='large' component="label" sx={{ my: 1 }}>
            Upload image
            <input type="file" hidden accept=".png, .jpg, .jpeg" onChange={handleUploadImage} />
          </Button>
          {errorDetails.productImage && <Typography color="#d32f2f" variant="caption" textAlign="center">Please upload image</Typography>}
        </Box>
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
          sx={{ mb: 2.5, mr: 2, width: "200px" }}
          size="large"
          onClick={handleAddProduct}
        >
          Add Product
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}