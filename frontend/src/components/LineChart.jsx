//frontend/src/components/LineChart.jsx
import React, { useContext, useMemo, useState } from 'react';
import { CompanyContext } from '../state/CompanyContext';
import { useQuery } from '@tanstack/react-query';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box } from '@mui/material';
import {
    ResponsiveChartContainer,
    LinePlot,
    ChartsXAxis,
    ChartsYAxis,
    ChartsTooltip,
    ChartsLegend,
  } from '@mui/x-charts';

// fetch postings for a given company
const fetchPostings = async (companyId) => {
  const api = process.env.REACT_APP_API_URL;
  const url = new URL(`${api}/postings/`);
  if (companyId) url.searchParams.append('company', companyId);
  const res = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
  });
  return res.json();
};

const getMonthYear = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    return `${month}-${year}`;
}

const PostingsLineChart = ({
  accountHandleNumber,
  postDateRange,
  suspiciousFilter,
  width = '80%',
  height = '600px',
}) => {
  const [fromDate, toDate] = postDateRange;
  const { selectedCompany } = useContext(CompanyContext);
  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ['postings', selectedCompany],
    queryFn: () => fetchPostings(selectedCompany),
    staleTime: Infinity,
    placeholderData: [],
  });


  //client side filter
  const filteredRows = useMemo(() => {
    return rows.filter(row => {
      if (accountHandleNumber && 
        String(row.accountHandleNumber) !== String(accountHandleNumber)) {
          return false;
    }
    if (suspiciousFilter === 'only' && !row.is_suspicious) return false;
    if (suspiciousFilter === 'exclude' && row.is_suspicious) return false;
    const [day, month, year] = row.postDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    if (fromDate && date < fromDate) return false;
    if (toDate && date > toDate) return false;
    return true;
  });
  }, [rows, accountHandleNumber, fromDate, toDate, suspiciousFilter]);



  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading postings</div>;

  const monthSums = {};
  filteredRows.forEach((row) => {
    const month = getMonthYear(row.postDate);
    const amount = Number(row.postAmount) || 0;
    monthSums[month] = (monthSums[month] || 0) + amount;
  });

  // Sort months chronologically
  const months = Object.keys(monthSums).sort((a, b) => {
    // "01-2022" => [2022, 1]
    const [mA, yA] = a.split('-').map(Number);
    const [mB, yB] = b.split('-').map(Number);
    return yA - yB || mA - mB;
  });

  const xData = months;
  const yData = months.map((month) => monthSums[month]);


  return (
    <Box
  display="flex"
  justifyContent="center"
  alignItems="center"
>
  <Box width={width} height={height} margin="20px">
    <ResponsiveChartContainer
      series={[{ type: 'line', data: yData, label: 'Total Post Amount' }]}
      xAxis={[{ scaleType: 'band', data: xData, label: 'Month-Year' }]}
      margin={{left: 75 }}
    >
      <LinePlot />
      <ChartsXAxis />
      <ChartsYAxis />
      <ChartsTooltip />
      <ChartsLegend />
    </ResponsiveChartContainer>
  </Box>
</Box>

  );
};

export default PostingsLineChart;
