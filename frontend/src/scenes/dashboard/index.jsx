import Header from "../../components/Header";
import { styled } from "@mui/material/styles";
import { tokens } from "../../theme";
import { CompanyContext } from "../../state/CompanyContext";
import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import StatCard from "../../components/StatCard";
import PostingsLineChart from "../../components/LineChart";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Select,
  Divider,
  MenuItem as MuiMenuItem,
} from "@mui/material";

import FlagIcon from "@mui/icons-material/Flag";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PlusOneIcon from "@mui/icons-material/PlusOne";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

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
  const totalThis = thisYearData.reduce(
    (sum, p) => sum + Number(p.postAmount),
    0
  );
  const countThis = thisYearData.length;
  const flaggedThis = thisYearData.filter((p) => p.is_suspicious).length;

  const lastYear = thisYear - 1;
  const lastYearData = postings.filter(
    (p) => new Date(p.postDate).getFullYear() === lastYear
  );

  const totalLast = lastYearData.reduce(
    (sum, p) => sum + Number(p.postAmount),
    0
  );
  const countLast = lastYearData.length;
  const flaggedLast = lastYearData.filter((p) => p.is_suspicious).length;

  const columns = [
    { field: "id", headerName: "ID", flex: 1, },
    {
      field: "postAmount",
      headerName: "Amount",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "postCurrency",
      headerName: "Currency",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "postDate",
      headerName: "Date",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "is_suspicious",
      headerName: "Status",
      headerAlign: "left",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        return params.row.is_suspicious ? (
          <CancelOutlinedIcon sx={{ color: colors.red }} />
        ) : (
          <CheckCircleOutlinedIcon sx={{ color: colors.green }} />
        );
      },
    },
  ];

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
          icon={<AttachMoneyIcon />}
          label="Postings amount"
          currentValue={isLoading ? null : totalThis}
          previousValue={isLoading ? null : totalLast}
        />

        <StatCard
          icon={<PlusOneIcon />}
          label="Amount of postings"
          currentValue={isLoading ? null : countThis}
          previousValue={isLoading ? null : countLast}
        />

        <StatCard
          icon={<FlagIcon />}
          label="Flagged postings"
          currentValue={isLoading ? null : flaggedThis}
          previousValue={isLoading ? null : flaggedLast}
        />

        <StatCard value="8.123" label="More data" percent="18%" />

        <Box
          bgcolor={colors.boxes}
          borderRadius="5px"
          gridColumn="span 3"
          minHeight="300px"
          maxHeight="300px"
        >
          <PostingsLineChart
            accountHandleNumber={""}
            postDateRange={[null, null]}
            suspiciousFilter={"all"}
            width="100%"
            height="300px"
          />
        </Box>
        <Box
          bgcolor={colors.boxes}
          borderRadius="5px"
          gridColumn="span 1"
          minHeight="300px"
          maxHeight="300px"
        >
          <DataGrid
            rows={postings}
            columns={columns}
            loading={isLoading}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            disableRowSelectionOnClick
            sortModel={[{ field: "postDate", sort: "desc" }]}
            sx={{
              "& .MuiDataGrid-cell": { borderBottom: "none" },
              "& .MuiDataGrid-columnHeaders": {
                background: colors.primaryDark,
              },
            }}
          />
        </Box>

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
