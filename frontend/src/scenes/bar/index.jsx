//frontend/src/scenes/bar/index.jsx
import React from "react";
import { Box } from "@mui/material";
import BarChartComponent from "../../components/BarChart";

const BarChartScene = () => {
  return (
    <Box m="20px">
      <h1>Postings Bar Chart</h1>
      <BarChartComponent />
    </Box>
  );
};

export default BarChartScene;