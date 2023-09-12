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
import { Typography } from '@mui/material';
import { XMarkIcon } from '@heroicons/react/24/outline';

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

  function handleUploadImage(event) {
    if(event.target.files.length) {
      const fileSize = Math.round(event.target.files[0].size/1024);
      if(fileSize/1024 >= 2){
        toast.error="File size should not exceed more than 2mb"
      } else {
        const selectedFile = event.target.files[0];
        convertToBase64(selectedFile)
        .then(res => {
          console.log(res);
          setSelectedProduct(prev => ({...prev, productImage: res}))          
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
        product_image: selectedProduct.productImage,
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

  function handleDeleteImage() {
    setSelectedProduct(prev => ({...prev, product_image: ""}))
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
        <Box display="flex" justifyContent="center" flexDirection="column" my={1}>
          {selectedProduct.product_image && 
            <Box display="flex" justifyContent="center">
              <Box position="relative">
                <img src={selectedProduct.product_image} alt="product_image" width="70px" height="70px" style={{borderRadius: "4px", border:"2px solid #939394", margin:"10px auto"}} />
                <XMarkIcon onClick={handleDeleteImage} style={{position: "absolute", top: "3px", right:"-10px", width:"20px", height:"20px", background:"#939394", borderRadius:"50%", cursor:"pointer"}} />
              </Box>
            </Box>
          }
          <Typography variant="caption" textAlign="center">Accepts .png, .jpg, .jpeg and image size should be less than 2mb</Typography>
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
          onClick={handleEditProduct}
        >
          Edit Product
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}