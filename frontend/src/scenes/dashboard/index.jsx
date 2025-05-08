import Header from "../../components/Header";
import { styled } from "@mui/material/styles";
import { tokens } from "../../theme";
import { CompanyContext } from "../../state/CompanyContext";
import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
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

import FlagIcon from '@mui/icons-material/Flag';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PlusOneIcon from '@mui/icons-material/PlusOne';

const api = process.env.REACT_APP_API_URL;

const fetchPostings = async (companyId) => {
  const url = new URL(`${api}/postings/`);
  if (companyId) url.searchParams.append("company", companyId);
  const res = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data.map((item) => ({ ...item, id: item.id }));
};

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { selectedCompany } = useContext(CompanyContext);

    const { data: postings = [], isLoading } = useQuery({
        queryKey: ["postings", selectedCompany],
        queryFn: () => fetchPostings(selectedCompany),
        staleTime: Infinity,
        keepPreviousData: true,
    });

    const thisYear = new Date().getFullYear();
    const thisYearData = postings.filter(
      (p) => new Date(p.postDate).getFullYear() === thisYear
    );
    const totalThis = thisYearData.reduce((sum, p) => sum + Number(p.postAmount), 0);
    const countThis = thisYearData.length;
    const flaggedThis = thisYearData.filter((p) => p.is_suspicious).length;

    const lastYear = thisYear - 1;
    const lastYearData = postings.filter(
      (p) => new Date(p.postDate).getFullYear() === lastYear
    );

    const totalLast = lastYearData.reduce((sum, p) => sum + Number(p.postAmount), 0);
    const countLast = lastYearData.length;
    const flaggedLast = lastYearData.filter((p) => p.is_suspicious).length;



  return (
    <Box m="20px">
      

      <Box
        display="grid"
        gridTemplateColumns="repeat(4, 1fr)"
        gridTemplateRows="100px 1fr 1fr"
        gap="24px"
        mt={4}
        sx={{ minHeight: "80vh" }}

      >
        <StatCard 
        icon={<AttachMoneyIcon/>} 
        label="Postings amount" 
        currentValue={ isLoading ? "..." : totalThis.toLocaleString()} 
        previousValue={ isLoading ? "..." : totalLast.toLocaleString()}
        percent="10%" />

        <StatCard 
        icon={<PlusOneIcon/>} 
        label="Amount of postings" 
        currentValue={ isLoading ? "..." : countThis.toLocaleString()} 
        previousValue={ isLoading ? "..." : countLast.toLocaleString()}
        percent="32%" />

        <StatCard 
        icon={<FlagIcon/>} 
        label="Flagged postings" 
        currentValue={ isLoading ? "..." : flaggedThis.toLocaleString()} 
        previousValue={ isLoading ? "..." : flaggedLast.toLocaleString()}
        percent="23%" />

        <StatCard 
        value="8.123" 
        label="More data" 
        percent="18%" />

        <Box
          bgcolor={colors.boxes}
          borderRadius="5px"
          gridColumn="span 3"
          minHeight="300px"
        />
        <Box
          bgcolor={colors.boxes}
          borderRadius="5px"
          gridColumn="span 1"
          minHeight="300px"
        />

        <Box
          bgcolor={colors.boxes}
          borderRadius="5px"
          gridColumn="span 2"
          minHeight="300px"
        />
        <Box
          bgcolor={colors.boxes}
          borderRadius="5px"
          gridColumn="span 2"
          minHeight="300px"
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
