import { Box, Typography, Button, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import Loader from "../../../components/common/Loader";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import AddProductDialog from "./AddProductDailog";
import { deleteProductRequest, getProductsRequest } from "../../../services/adminService";
import { toast } from "material-react-toastify";
import EditProductDialog from "./EditProductDialog";
import Pagination from "../../../components/common/Pagination";
import useWindowResizeHandler from "../../../hooks/useWindowResizeHandler";

export default function Products() {
  const [productsList, setProductsList] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [selectedProductIndex, setSelectedProductIndex] = useState();
  const isValidScreenSize = useWindowResizeHandler();

  useEffect(() => {
    setIsLoading(true);
    getProductsRequest(1)
    .then((res) => {
      setProductsList(res.data.data.products.docs);
      setProductDetails(res.data.data.products);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, []);

  // useEffect(() => {
  //   console.log(ms('2 days'));
  //   const days = ms('2 days');
  //   const date1 = new Date("2023-08-18");
  //   const date2 = new Date("2023-08-20");
  //   const diff = date2 - date1;
  //   console.log(diff === days, diff, days);
  // },[])

  function handleDelete(product, index) {
    deleteProductRequest(product._id)
      .then((res) => {
        if (res.data.status === 200) {
          toast.success("Product deleted successfully");
          productsList.splice(index, 1);
          setProductsList([...productsList]);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  }

  function handleEdit(product, index) {
    setSelectedProduct(product);
    setIsEditProductDialogOpen(true);
    setSelectedProductIndex(index);
  }

  function handleUpdate() {
    const modifiedProductsList = [...productsList];
    modifiedProductsList[selectedProductIndex] = { ...selectedProduct };
    setProductsList(modifiedProductsList);
    setSelectedProductIndex();
  }

  function handlePageChange(pageNo) {
    setIsLoading(true);
    getProductsRequest(pageNo)
    .then((res) => {
      setProductsList(res.data.data.products.docs);
      setProductDetails(res.data.data.products);
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
            <Typography variant="h4">Products</Typography>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              size="large"
              onClick={() => setIsAddProductDialogOpen(true)}
            >
              Add Product
            </Button>
          </Box>
          {productsList.length === 0 && (
            <Typography>No products availabe, Please add products</Typography>
          )}
          {productsList.length !== 0 && (
            <TableContainer component={Paper} sx={{ mt: 4 }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{width: "150px"}}>Product Name</TableCell>
                    <TableCell style={{width: "300px"}} align="center">Product Description</TableCell>
                    <TableCell align="center">Product Amount</TableCell>
                    <TableCell align="center">Product Offering 1</TableCell>
                    <TableCell align="center">Product Offering 2</TableCell>
                    <TableCell align="center">Product Offering 3</TableCell>
                    <TableCell style={{ width: "10px" }}>Edit</TableCell>
                    <TableCell style={{ width: "10px" }}>Delete</TableCell>
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
                        <Tooltip title="Edit">
                          <PencilSquareIcon
                            style={{ width: "30px", height: "30px" }}
                            color="#4848e9"
                            onClick={() => handleEdit(product, index)}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Delete">
                          <TrashIcon
                            style={{ width: "30px", height: "30px" }}
                            color="#4848e9"
                            onClick={() => handleDelete(product, index)}
                          />
                        </Tooltip>
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
      </Box>
      <AddProductDialog
        open={isAddProductDialogOpen}
        setOpen={setIsAddProductDialogOpen}
        setProductsList={setProductsList}
        productsList={productsList}
      />
      <EditProductDialog
        open={isEditProductDialogOpen}
        setOpen={setIsEditProductDialogOpen}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        handleUpdate={handleUpdate}
      />
    </>
  );
}
