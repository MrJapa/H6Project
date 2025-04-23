//frontend/src/scenes/pie/index.jsx
import React from "react";
import { Box } from "@mui/material";
import PieChartComponent from "../../components/PieChart";

const PieChartScene = () => {
  return (
    <Box m="20px">
      <h1>Postings Pie Chart</h1>
      <PieChartComponent />
    </Box>
  );
};

export default PieChartScene;