//frontend/src/scenes/line/index.jsx
import React from "react";
import { Box } from "@mui/material";
import LineChartComponent from "../../components/LineChart";

const LineChartScene = () => {
  return (
    <Box m="20px">
      <h1>Postings Line Chart</h1>
      <LineChartComponent />
    </Box>
  );
};

export default LineChartScene;