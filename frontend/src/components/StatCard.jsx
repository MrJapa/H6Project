import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import React from "react";



const PieChartPlaceholder = () => (
  <Box
    width={60}
    height={60}
    bgcolor="#D6D6D6"
    borderRadius="50%"
    display="flex"
    alignItems="center"
    justifyContent="center"
    color="#222"
    fontSize={14}
  >
    <Typography align="center" variant="caption">
      PIE<br/>CHART
    </Typography>
  </Box>
);

const StatCard = ({ icon, currentValue, previousValue, label, percent }) => {

  const iconElement =
    React.isValidElement(icon)
    ? React.cloneElement(icon, { fontSize: "large" })
    : null;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
  <Box
  position="relative"
  bgcolor={colors.boxes}
  color="#fff"
  p={1.5}
  borderRadius={2}
  display="flex"
  flexDirection="column"
  height="100%"
  justifyContent="space-between"
  boxSizing="border-box"
  >
    <Box textAlign="center">
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
    </Box>

    <Box position="relative" flexGrow={1}>

        {iconElement && (
          <Box
            position="absolute"
            left={16}
            top="50%"
            sx={{ transform: "translateY(-50%)" }}
          >
            {iconElement}
          </Box>
        )}


        <Box
          position="absolute"
          left="50%"
          top="50%"
          sx={{ transform: "translate(-50%, -50%)" }}
          textAlign="center"
        >
          <Typography variant="h5" fontWeight="bold">
            {currentValue}
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {previousValue}
          </Typography>
        </Box>
      </Box>


      <Box
        position="absolute"
        bottom={16}
        right={16}
        display="flex"
        alignItems="center"
      >
        <Typography variant="caption" mr={1}>
          {percent}
        </Typography>
        <PieChartPlaceholder />
      </Box>
    </Box>
);
};

export default StatCard;
