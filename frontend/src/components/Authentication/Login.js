import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import backgroundImage from "./homeimage.avif";
import { useNavigate } from "react-router-dom";
const AWS = require("aws-sdk");
const configureAWS = require("../Config");

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");
  configureAWS();
  const changepage = useNavigate();

  async function getLoginAPI() {
    try {
      const ssm = new AWS.SSM();
      const parameterName = "/authAPI";
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

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const apiGatewayUrl = await getLoginAPI();
      console.log(apiGatewayUrl);
      const response = await axios.post(`${apiGatewayUrl}/auth`, {
        email,
        password,
      });

      window.localStorage.setItem("email", email);
      console.log("Logged in successfully!", response.data);

      setToastMessage("Logged in successfully!");
      setToastSeverity("success");
      setToastOpen(true);

      setTimeout(() => {
        changepage("/inventory");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      setToastMessage("Login failed. Please try again.");
      setToastSeverity("error");
      setToastOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setIsLoading(true);
      const apiGatewayUrl = await getLoginAPI();
      console.log(apiGatewayUrl);
      const response = await axios.post(`${apiGatewayUrl}/auth`, {
        email,
        password,
      });
      window.localStorage.setItem("email", email);

      console.log("Signup in successfully!", response.data);
      setToastMessage("Signup successfully!");
      setToastSeverity("success");
      setToastOpen(true);

      setTimeout(() => {
        changepage("/inventory");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      setToastMessage("Login failed. Please try again.");
      setToastSeverity("error");
      setToastOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  const toggleMode = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  return (
    <>
      <Typography
        variant="h3"
        align="center"
        style={{
          color: "blue",
          fontFamily: "cursive",
          fontWeight: "bold",
        }}
      >
        Welcome to Billventory
      </Typography>
      <div
        style={{
          display: "flex",
          height: "85vh",
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Container
          maxWidth="sm"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1" align="center">
            {isLogin ? "Login" : "Signup"}
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" fullWidth type="submit">
              {isLogin ? "Login" : "Signup"}
            </Button>
          </form>
          <Button variant="text" color="primary" fullWidth onClick={toggleMode}>
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </Button>
        </Container>
      </div>

      <Snackbar
        open={toastOpen}
        autoHideDuration={2000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={toastSeverity}
          onClose={handleToastClose}
        >
          {toastMessage}
        </MuiAlert>
      </Snackbar>

      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <CircularProgress color="primary" />
        </div>
      )}
    </>
  );
};

export default Login;
