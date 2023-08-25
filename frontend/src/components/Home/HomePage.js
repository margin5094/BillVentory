import React, { useEffect, useState } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Edit, Delete, Save, Cancel } from "@mui/icons-material";
import Navbar from "./Navbar";
import axios from "axios";
const AWS = require("aws-sdk");
const configureAWS = require("../Config");

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProductName, setEditingProductName] = useState("");
  const [editingProductPrice, setEditingProductPrice] = useState("");
  const [editingProductCategory, setEditingProductCategory] = useState("");
  const [editingProductQuantity, setEditingProductQuantity] = useState("");
  const [editingProductManufacturer, setEditingProductManufacturer] =
    useState("");
  configureAWS();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };
  async function getProductsGatewayUrl() {
    try {
      const ssm = new AWS.SSM();
      const parameterName = "/getProducts";
      const parameter = await ssm
        .getParameter({ Name: parameterName, WithDecryption: false })
        .promise();
      return parameter.Parameter.Value;
    } catch (error) {
      console.error(
        "Error fetching API Gateway URL from SSM Parameter Store:",
        error
      );

      return "https://your-default-api-gateway-url.com";
    }
  }
  useEffect(() => {
    async function fetchData() {
      try {
        const apiGatewayUrl = await getProductsGatewayUrl();
        console.log(apiGatewayUrl);
        const res = await axios.get(`${apiGatewayUrl}/getproducts`);

        const responseData = res.data;
        console.log(responseData);

        const products = responseData.products;
        setProducts(products);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleEditClick = (productId) => {
    const productToEdit = products.find(
      (product) => product.productId === productId
    );
    setEditingProductId(productId);
    setEditingProductName(productToEdit.productName);
    setEditingProductPrice(productToEdit.productPrice);
    setEditingProductCategory(productToEdit.productCategory);
    setEditingProductQuantity(productToEdit.productQuantity);
    setEditingProductManufacturer(productToEdit.productManufacturer);
  };

  async function getApiGatewayUrl() {
    try {
      const ssm = new AWS.SSM();
      const parameterName = "/APIaddProducts";
      const parameter = await ssm
        .getParameter({ Name: parameterName, WithDecryption: false })
        .promise();
      return parameter.Parameter.Value;
    } catch (error) {
      console.error(
        "Error fetching API Gateway URL from SSM Parameter Store:",
        error
      );

      return "https://your-default-api-gateway-url.com";
    }
  }

  const handleSaveClick = async (productId) => {
    console.log(editingProductPrice);
    const apiGatewayUrl = await getApiGatewayUrl();
    axios
      .post(`${apiGatewayUrl}/addproduct`, {
        products: [
          {
            productId: editingProductId,
            productName: editingProductName,
            productPrice: editingProductPrice,
            productCategory: editingProductCategory,
            productQuantity: editingProductQuantity,
            productManufacturer: editingProductManufacturer,
          },
        ],
      })
      .then((response) => {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.productId === productId
              ? {
                  ...product,
                  productId: editingProductId,
                  productName: editingProductName,
                  productPrice: editingProductPrice,
                  productCategory: editingProductCategory,
                  productQuantity: editingProductQuantity,
                  productManufacturer: editingProductManufacturer,
                }
              : product
          )
        );
        setEditingProductId(null);
        setSnackbarMessage("Product edited successfully!");
        setSnackbarSeverity("success");
        setShowSnackbar(true);
      })
      .catch((error) => {
        console.error("Error editing product details:", error);
        setSnackbarMessage("Failed to edit product!");
        setSnackbarSeverity("error");
        setShowSnackbar(true);
      });
  };

  const handleCancelClick = () => {
    setEditingProductId(null);
  };

  const isRowInEditMode = (productId) => {
    return productId === editingProductId;
  };

  return (
    <div>
      <Navbar />
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        style={{ padding: "20px" }}
      >
        {loading ? (
          <CircularProgress size={60} style={{ marginTop: "2rem" }} />
        ) : products.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              marginTop: "40px",
              fontSize: "40px",
              color: "blue",
            }}
          >
            Inventory empty...
          </div>
        ) : (
          <Grid item md={10}>
            <TableContainer
              component={Paper}
              style={{
                borderRadius: 10,
                boxShadow:
                  "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)",
              }}
            >
              <Table style={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                    <TableCell>Product ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Manufacturer</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.productId}
                      style={{
                        "&:nth-of-type(even)": { backgroundColor: "#f9f9f9" },
                      }}
                    >
                      <TableCell>
                        {isRowInEditMode(product.productId) ? (
                          <TextField
                            disabled
                            value={
                              editingProductId === product.productId
                                ? editingProductId
                                : product.productId
                            }
                            fullWidth
                            onChange={(e) =>
                              setEditingProductId(e.target.value)
                            }
                          />
                        ) : (
                          product.productId
                        )}
                      </TableCell>
                      <TableCell>
                        {isRowInEditMode(product.productId) ? (
                          <TextField
                            value={editingProductName}
                            fullWidth
                            onChange={(e) =>
                              setEditingProductName(e.target.value)
                            }
                          />
                        ) : (
                          product.productName
                        )}
                      </TableCell>
                      <TableCell>
                        {isRowInEditMode(product.productId) ? (
                          <TextField
                            value={editingProductPrice}
                            fullWidth
                            onChange={(e) =>
                              setEditingProductPrice(e.target.value)
                            }
                          />
                        ) : (
                          `$${product.productPrice}`
                        )}
                      </TableCell>
                      <TableCell>
                        {isRowInEditMode(product.productId) ? (
                          <TextField
                            value={editingProductCategory}
                            fullWidth
                            onChange={(e) =>
                              setEditingProductCategory(e.target.value)
                            }
                          />
                        ) : (
                          product.productCategory
                        )}
                      </TableCell>
                      <TableCell>
                        {isRowInEditMode(product.productId) ? (
                          <TextField
                            value={editingProductQuantity}
                            fullWidth
                            onChange={(e) =>
                              setEditingProductQuantity(e.target.value)
                            }
                          />
                        ) : (
                          product.productQuantity
                        )}
                      </TableCell>
                      <TableCell>
                        {isRowInEditMode(product.productId) ? (
                          <TextField
                            value={editingProductManufacturer}
                            fullWidth
                            onChange={(e) =>
                              setEditingProductManufacturer(e.target.value)
                            }
                          />
                        ) : (
                          product.productManufacturer
                        )}
                      </TableCell>

                      <TableCell>
                        {isRowInEditMode(product.productId) ? (
                          <>
                            <IconButton
                              color="primary"
                              aria-label="save"
                              onClick={() => handleSaveClick(product.productId)}
                            >
                              <Save />
                            </IconButton>
                            <IconButton
                              color="secondary"
                              aria-label="cancel"
                              onClick={handleCancelClick}
                            >
                              <Cancel />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton
                            color="primary"
                            aria-label="edit"
                            onClick={() => handleEditClick(product.productId)}
                          >
                            <Edit />
                          </IconButton>
                        )}
                        <IconButton color="secondary" aria-label="delete">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default HomePage;
