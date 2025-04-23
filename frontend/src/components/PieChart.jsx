import React, { useContext } from 'react';
import { CompanyContext } from '../state/CompanyContext';
import { useQuery } from '@tanstack/react-query';
import { Box } from '@mui/material';
import {
  ResponsiveChartContainer,
  PiePlot,
  ChartsLegend,
  ChartsTooltip,
} from '@mui/x-charts';

const fetchPostings = async (companyId) => {
    const url = new URL('http://localhost:8000/api/postings/');
    if (companyId) url.searchParams.append('company', companyId);
    const res = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
    });
    return res.json();
  };

const PostingsPieChart = () => {
  const { selectedCompany } = useContext(CompanyContext);
  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ['postings', selectedCompany],
    queryFn: () => fetchPostings(selectedCompany),
    staleTime: Infinity,
    placeholderData: [],
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading postings</div>;

  // Group by accountHandleNumber and sum amounts
  const accountSums = {};
  rows.forEach((row) => {
    const acc = row.accountHandleNumber;
    const amount = Number(row.postAmount) || 0;
    accountSums[acc] = (accountSums[acc] || 0) + amount;
  });

  // Prepare data for PiePlot: array of { id, value, label }
  let pieData = Object.entries(accountSums).map(([acc, value]) => ({
    id: acc,
    value,
    label: `Account ${acc}`,
  }));

  // Sort descending by value and keep only top 5
  pieData = pieData
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Box width="500px" height="500px">
        <ResponsiveChartContainer
          series={[{ type: 'pie', data: pieData }]}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <PiePlot />
          <ChartsLegend position="right" />
          <ChartsTooltip />
        </ResponsiveChartContainer>
      </Box>
    </Box>
  );
};

export default PostingsPieChart;
