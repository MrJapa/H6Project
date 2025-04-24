import Header from "../../components/Header";
import { styled } from "@mui/material/styles";
import { tokens } from "../../theme";
import { CompanyContext } from "../../state/CompanyContext";
import React, { useState, useEffect, useContext } from "react";
import StatCard from "../../components/StatCard";
import {
    Box,
    IconButton,
    Typography,
    useTheme,
    Select,
    Divider,
    MenuItem as MuiMenuItem,
  } from "@mui/material";


const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { company } = useContext(CompanyContext);

  return (
    <Box m="20px">
      

      {/* Dashboard Grid */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(4, 1fr)"
        gridTemplateRows="100px 1fr 1fr"
        gap="24px"
        mt={4}
        sx={{ minHeight: "80vh" }}

      >
        {/* Top row: Four small cards */}
        <StatCard value="12.304" label="Postings amount" percent="10%" />
        <StatCard value="2.101" label="Another stat" percent="32%" />
        <StatCard value="5.400" label="Something else" percent="23%" />
        <StatCard value="8.123" label="More data" percent="18%" />

        {/* Middle row: Two large cards */}
        <Box
          bgcolor={colors.primary}
          borderRadius="5px"
          gridColumn="span 3"
          minHeight="300px"
        />
        <Box
          bgcolor={colors.primary}
          borderRadius="5px"
          gridColumn="span 1"
          minHeight="300px"
        />

        {/* Bottom row: Two large cards */}
        <Box
          bgcolor={colors.primary}
          borderRadius="5px"
          gridColumn="span 2"
          minHeight="300px"
        />
        <Box
          bgcolor={colors.primary}
          borderRadius="5px"
          gridColumn="span 2"
          minHeight="300px"
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
