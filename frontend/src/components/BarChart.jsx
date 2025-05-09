import React, { useContext, useMemo } from "react";
import { CompanyContext } from "../state/CompanyContext";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography } from "@mui/material";
import {
  ResponsiveChartContainer,
  BarPlot,
  ChartsXAxis,
  ChartsYAxis,
  ChartsTooltip,
  ChartsLegend,
} from "@mui/x-charts";


const fetchPostings = async (companyId) => {
  const api = process.env.REACT_APP_API_URL;
  const url = new URL(`${api}/postings/`);
  if (companyId) url.searchParams.append("company", companyId);
  const res = await fetch(url.toString(), { method: "GET", credentials: "include" });
  return res.json();
};


const getMonthYear = (dateStr) => {
  const [day, month, year] = dateStr.split("-");
  return `${month}-${year}`;
};

const PostingsBarChart = ({ accountHandleNumber, postDateRange, suspiciousFilter }) => {
  const [fromDate, toDate] = postDateRange;
  const { selectedCompany } = useContext(CompanyContext);
  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ["postings", selectedCompany],
    queryFn: () => fetchPostings(selectedCompany),
    staleTime: Infinity,
    placeholderData: [],
  });

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        if (
          accountHandleNumber &&
          String(row.accountHandleNumber) !== String(accountHandleNumber)
        )
          return false;
        if (suspiciousFilter === "only" && !row.is_suspicious) return false;
        if (suspiciousFilter === "exclude" && row.is_suspicious) return false;
        const [day, month, year] = row.postDate.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        if (fromDate && date < fromDate) return false;
        if (toDate && date > toDate) return false;
        return true;
      }),
    [rows, accountHandleNumber, suspiciousFilter, fromDate, toDate]
  );


  const monthSums = useMemo(() => {
    const sums = {};
    filteredRows.forEach((row) => {
      const amount = parseFloat(row.postAmount);
      if (isNaN(amount)) return;
      const month = getMonthYear(row.postDate);
      sums[month] = (sums[month] || 0) + amount;
    });
    return sums;
  }, [filteredRows]);


  const months = useMemo(
    () =>
      Object.keys(monthSums).sort((a, b) => {
        const [mA, yA] = a.split("-").map(Number);
        const [mB, yB] = b.split("-").map(Number);
        return yA - yB || mA - mB;
      }),
    [monthSums]
  );

  const xData = months;
  const yData = months.map((m) => monthSums[m]);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading postings</Typography>;
  if (xData.length === 0) return <Typography>No data for selected filters</Typography>;

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Box width="80%" height="600px" margin="20px">
        <ResponsiveChartContainer
          series={[{ type: "bar", data: yData, label: "Total Post Amount" }]}
          xAxis={[{ scaleType: "band", data: xData, label: "Month-Year" }]}
          margin={{ left: 75 }}
        >
          <BarPlot />
          <ChartsXAxis />
          <ChartsYAxis />
          <ChartsTooltip formatter={(value) => (typeof value === 'number' ? value.toLocaleString() : value)} />
          <ChartsLegend />
        </ResponsiveChartContainer>
      </Box>
    </Box>
  );
};

export default PostingsBarChart;
