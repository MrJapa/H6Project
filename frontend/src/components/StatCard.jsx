import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import React from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";


const StatCard = ({ icon, currentValue = 0, previousValue = 0, label }) => {

  const currNum = Number(
    typeof currentValue === 'string'
      ? currentValue.replace(/[^\d.-]/g, '')
      : currentValue
  );
  const prevNum = Number(
    typeof previousValue === 'string'
      ? previousValue.replace(/[^\d.-]/g, '')
      : previousValue
  );

  const percentage = prevNum > 0
    ? Math.round((currNum / prevNum) * 100)
    : 0;

  const niceCurr = currNum.toLocaleString();
  const nicePrev = prevNum.toLocaleString();

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
            {currentValue != null ? currentValue.toLocaleString() : "..."}
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {previousValue != null ? previousValue.toLocaleString() : "..."}
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
        <Gauge
        width={80}
        height={60}
        value={percentage}
        minValue={0}
        maxValue={prevNum > 0 ? prevNum : 0}
        startAngle={-90}
        endAngle={90}
        text={`${percentage}%`}
        sx={(theme) => ({
        [`& .${gaugeClasses.valueArc}`]: {
          fill: colors.light_blue,
        },
        })}
        />
      </Box>
    </Box>
);
};

export default StatCard;
