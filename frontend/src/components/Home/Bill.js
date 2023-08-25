import React, { useState } from "react";
import Navbar from "./Navbar";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Paper,
  Grid,
  Modal,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { AddCircle, Delete } from "@mui/icons-material";
import axios from "axios";
import billImage from "./bill.avif";
const AWS = require("aws-sdk");
const configureAWS = require("../Config");

const Bill = () => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };
  configureAWS();
  async function getApiGenerateBill() {
    try {
      const ssm = new AWS.SSM();
      const parameterName = "/generatebill";
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

  const [billModalOpen, setBillModalOpen] = useState(false);
  const [billDetails, setBillDetails] = useState(null);
  const [items, setItems] = useState([
    { productId: "", productName: "", productPrice: "", productQuantity: "" },
  ]);

  const handleInputChange = (index, property, value) => {
    const newItems = [...items];
    newItems[index][property] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { productId: "", productName: "", productPrice: "", productQuantity: "" },
    ]);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleGenerateBill = async () => {
    const generatebillurl = await getApiGenerateBill();
    console.log(generatebillurl);
    const email = window.localStorage.getItem("email");
    const billData = {
      email,
      items,
    };
    console.log(billData);

    axios
      .post(`${generatebillurl}/bills`, billData)
      .then((response) => {
        console.log("Bill generated successfully!", response.data);
        setSnackbarMessage("Bill generated!");
        setSnackbarSeverity("success");
        setShowSnackbar(true);
      })
      .catch((error) => {
        console.error("Bill generation error:", error);
        setSnackbarMessage("Failed to generate bill!");
        setSnackbarSeverity("error");
        setShowSnackbar(true);
      });
  };
  const handleOpenBillModal = async () => {
    const generatebillurl = await getApiGenerateBill();
    console.log(generatebillurl);

    axios
      .get(`${generatebillurl}/bills`)
      .then((response) => {
        console.log("Fetched bill details:", response.data);

        setBillDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching bill details:", error);
      });
    setBillModalOpen(true);
  };
  return (
    <>
      <Navbar />
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
      <Grid container>
        <Grid item xs={8}>
          <Typography
            variant="h4"
            gutterBottom
            style={{ marginLeft: "2rem", marginTop: "2rem", color: "blue" }}
          >
            Generate Bill
            <Button
              variant="outlined"
              color="primary"
              style={{ marginLeft: "25rem" }}
              onClick={handleOpenBillModal}
            >
              View ALL Bills
            </Button>
          </Typography>

          <List style={{ marginLeft: "1rem" }}>
            {items.map((item, index) => (
              <ListItem key={index}>
                <Grid container spacing={2}>
                  <Grid item xs={2.6}>
                    <TextField
                      label="Product ID"
                      variant="outlined"
                      value={item.productId}
                      onChange={(e) =>
                        handleInputChange(index, "productId", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      label="Product Name"
                      variant="outlined"
                      value={item.productName}
                      onChange={(e) =>
                        handleInputChange(index, "productName", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4}>
                    <TextField
                      label="Product Price"
                      variant="outlined"
                      type="number"
                      value={item.productPrice}
                      onChange={(e) =>
                        handleInputChange(index, "productPrice", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4}>
                    <TextField
                      label="Product Quantity"
                      variant="outlined"
                      type="number"
                      value={item.productQuantity}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "productQuantity",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={2.6}>
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton onClick={handleAddItem}>
                      <AddCircle />
                    </IconButton>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "85%", marginLeft: "2rem" }}
            onClick={handleGenerateBill}
          >
            Generate Bill
          </Button>
        </Grid>
        <Grid item xs={4}>
          <img
            src={billImage}
            alt="Bill"
            style={{ width: "100%", height: "100%" }}
          />
        </Grid>
      </Grid>

      <Modal
        open={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "2rem",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {billDetails && (
            <div>
              <Typography variant="h6">All Bills:</Typography>
              {billDetails.map((bill) => (
                <Paper
                  key={bill.billId}
                  style={{ padding: "1rem", marginBottom: "1rem" }}
                >
                  <Typography variant="h6">Bill ID: {bill.billId}</Typography>
                  <Typography>Total Bill: {bill.totalBill}</Typography>
                  <Typography variant="subtitle1">Bill Items:</Typography>
                  <ul>
                    {bill.billItems.map((item, index) => (
                      <li key={index}>
                        {item.productName} (Quantity: {item.productQuantity},
                        Price: {item.productPrice})
                      </li>
                    ))}
                  </ul>
                </Paper>
              ))}
            </div>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={() => setBillModalOpen(false)}
            style={{ marginTop: "1rem" }}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Bill;
