import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import {
  Inventory,
  AddBox,
  Receipt,
  InventoryTwoTone,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const changePage = useNavigate();
  const handleAddStock = () => {
    changePage("/addstock");
  };
  const handleInventory = () => {
    changePage("/inventory");
  };
  const handleBill = () => {
    changePage("/bill");
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton color="inherit" edge="start" aria-label="inventory">
          <Inventory />
        </IconButton>

        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
          style={{ cursor: "pointer" }}
          onClick={handleInventory}
        >
          Inventory Management System
        </Typography>

        <Button
          color="inherit"
          aria-label="add-stock"
          onClick={handleInventory}
        >
          <InventoryTwoTone />
          <Typography variant="h6">Inventory</Typography>
        </Button>
        <Button color="inherit" aria-label="add-stock" onClick={handleBill}>
          <Receipt />
          <Typography variant="h6">Bills</Typography>
        </Button>
        <Button color="inherit" aria-label="add-stock" onClick={handleAddStock}>
          <AddBox />
          <Typography variant="h6">Add Stock</Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
