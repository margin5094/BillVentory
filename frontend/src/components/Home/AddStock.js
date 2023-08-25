import React, { useState } from "react";
import {
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Button,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"; // Icon for image upload
import Navbar from "./Navbar";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AWS = require("aws-sdk");
const configureAWS = require("../Config");

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
}));

const FormContainer = styled("form")({
  width: "100%",
});

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

configureAWS();

const AddStock = () => {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productManufacturer, setProductManufacturer] = useState("");
  const [productPdf, setProductPdf] = useState();
  const [pdfName, setPdfName] = useState("");

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const changepage = useNavigate();
  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Product Details:", {
      productId,
      productName,
      productPrice,
      productCategory,
      productQuantity,
      productManufacturer,
    });

    setProductId("");
    setProductName("");
    setProductPrice("");
    setProductCategory("");
    setProductQuantity("");
    setProductManufacturer("");
    setProductPdf(null);
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
  async function getApiGatewayUrl_pdftextract() {
    try {
      const ssm = new AWS.SSM();
      const parameterName = "/apipdftextract";
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

  const handleGeneralAdd = async () => {
    const apiGatewayUrl = await getApiGatewayUrl();
    console.log(apiGatewayUrl);
    axios
      .post(`${apiGatewayUrl}/addproduct`, {
        products: [
          {
            productId,
            productName,
            productPrice,
            productCategory,
            productQuantity,
            productManufacturer,
          },
        ],
      })
      .then((res) => {
        setSnackbarMessage("Product added successfully!");
        setSnackbarSeverity("success");
        setShowSnackbar(true);
      })
      .catch((err) => {
        console.log(err);
        setSnackbarMessage("Failed to add product!");
        setSnackbarSeverity("error");
        setShowSnackbar(true);
      });
  };

  const handlePdfChange = (e) => {
    const selectedFile = e.target.files[0];
    setPdfName(selectedFile.name);

    if (!selectedFile) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(selectedFile);
    fileReader.onload = function (fileLoadedEvent) {
      const fileData = fileLoadedEvent.target.result;

      setProductPdf(fileData);
    };
  };
  function removeBase64Prefix(base64String) {
    const prefixToRemove = "data:application/pdf;base64,";
    if (base64String.startsWith(prefixToRemove)) {
      return base64String.slice(prefixToRemove.length);
    }
    return base64String;
  }

  const handleTextractAdd = async () => {
    const parsePdf = removeBase64Prefix(productPdf);
    const apiGatewayUrl = await getApiGatewayUrl_pdftextract();
    console.log(apiGatewayUrl);
    axios
      .post(`${apiGatewayUrl}/upload`, {
        fileName: pdfName,
        pdfData: parsePdf,
      })
      .then((res) => {
        console.log(res);
        console.log("Uploaded Successfully!");
        setSnackbarMessage("Product added successfully!");
        setSnackbarSeverity("success");
        setShowSnackbar(true);
        setTimeout(() => {
          changepage("/inventory");
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        setSnackbarMessage("Failed to add product!");
        setSnackbarSeverity("error");
        setShowSnackbar(true);
      });
  };
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "1rem" }}>
        <Grid container spacing={3} justifyContent="space-between">
          <Grid item xs={10} md={4} style={{ marginLeft: "4rem" }}>
            <FormPaper>
              <Typography variant="h5" color="primary">
                Add New Product
              </Typography>
              <FormContainer onSubmit={handleSubmit}>
                <TextField
                  label="Product ID"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  fullWidth
                  required
                  style={{ marginBottom: "1rem" }}
                />
                <TextField
                  label="Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  fullWidth
                  required
                  style={{ marginBottom: "1rem" }}
                />
                <TextField
                  label="Price"
                  type="number"
                  value={productPrice}
                  style={{ marginBottom: "1rem" }}
                  onChange={(e) => setProductPrice(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Category"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  fullWidth
                  required
                  style={{ marginBottom: "1rem" }}
                />
                <TextField
                  label="Quantity"
                  type="number"
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(e.target.value)}
                  fullWidth
                  style={{ marginBottom: "1rem" }}
                  required
                />
                <TextField
                  label="Manufacturer"
                  style={{ marginBottom: "1rem" }}
                  value={productManufacturer}
                  onChange={(e) => setProductManufacturer(e.target.value)}
                  fullWidth
                  required
                />

                <SubmitButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={handleGeneralAdd}
                >
                  <AddCircleOutlineIcon style={{ marginRight: 8 }} />
                  Add Product
                </SubmitButton>
              </FormContainer>
            </FormPaper>
          </Grid>
          <Grid item xs={12} md={6} style={{ marginRight: "4rem" }}>
            <Paper>
              <Typography
                variant="h6"
                color="primary"
                style={{ marginBottom: "1rem" }}
              >
                Directly upload stocks pdf and it will automatic added!
              </Typography>
              <label style={{ display: "block", marginBottom: 10 }}>
                <input
                  type="file"
                  accept="application/pdf"
                  style={{ display: "none" }}
                  onChange={handlePdfChange}
                  required
                />
                <Button
                  variant="contained"
                  color="secondary"
                  component="span"
                  startIcon={<PhotoCameraIcon />}
                >
                  Upload PDF of Stocks
                </Button>
              </label>
              {productPdf && (
                <div>
                  <Typography variant="h6">Uploaded PDF:</Typography>
                  <iframe
                    src={productPdf}
                    width="100%"
                    height="600"
                    title="Uploaded PDF"
                  />
                </div>
              )}
              <SubmitButton
                type="submit"
                fullWidth
                variant="contained"
                onClick={handleTextractAdd}
              >
                <AddCircleOutlineIcon style={{ marginRight: 8 }} />
                Add Product
              </SubmitButton>
            </Paper>
          </Grid>
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
    </div>
  );
};

export default AddStock;
