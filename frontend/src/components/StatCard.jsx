import { Box, Typography } from "@mui/material";

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

const StatCard = ({ icon, value, label, percent }) => (
  <Box
    bgcolor="#1b232b"
    color="#fff"
    p={1.5}
    borderRadius="5px"
    display="flex"
    flexDirection="column"
    height="100%"
    justifyContent="space-between"
  >
    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
      {/* Icon placeholder */}
      <Box
        width={36}
        height={36}
        bgcolor="#fff"
        color="#222"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize={14}
        borderRadius={2}
        mr={1}
      >
        {icon || "ICON"}
      </Box>
      <PieChartPlaceholder />
    </Box>
    <Box display="flex" justifyContent="space-between" alignItems="end">
      <Box>
        <Typography variant="h5" fontWeight={700} sx={{lineHeight:1}}>
          {value}
        </Typography>
        <Typography variant="body2">{label}</Typography>
      </Box>
      <Typography variant="h6" fontWeight={500}>
        {percent}
      </Typography>
    </Box>
  </Box>
);

export default StatCard;
