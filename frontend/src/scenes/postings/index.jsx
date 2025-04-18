// frontend/src/scenes/postings/index.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  IconButton,
  InputBase,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery } from "@tanstack/react-query";
import { CompanyContext } from "../../state/CompanyContext";

const fetchPostings = async (companyId) => {
  const url = new URL("http://localhost:8000/api/postings/");
  if (companyId) url.searchParams.append("company", companyId);
  const res = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data.map((item) => ({ ...item, id: item.id }));
};

const Postings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { selectedCompany } = useContext(CompanyContext);

  const { data: rows = [], isLoading, refetch } = useQuery({
    queryKey: ["postings", selectedCompany],
    queryFn: () => fetchPostings(selectedCompany),
    staleTime: Infinity,
    keepPreviousData: true,
  });

  const [searchText, setSearchText] = useState("");
  const [filteredRows, setFilteredRows] = useState(rows);

  useEffect(() => {
    setFilteredRows(
      rows.filter((row) =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    );
  }, [rows, searchText]);

  const handleSearch = (e) => setSearchText(e.target.value);

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "accountHandleNumber", headerName: "Account" },
    {
      field: "postDescription",
      headerName: "Description",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "postAmount",
      headerName: "Amount",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "postCurrency",
      headerName: "Currency",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "postDate",
      headerName: "Date",
      headerAlign: "left",
      align: "left",
    },
  ];

  return (
    <Box m="20px">
      <Header title="POSTINGS" subtitle="Managing financial postings" />
      <Box display="flex" justifyContent="space-between" mb="15px">
        <Box display="flex" bgColor={colors.primary} borderRadius="3px">
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Search..."
            value={searchText}
            onChange={handleSearch}
          />
          <IconButton sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" />
        <Box display="flex">
          <IconButton onClick={() => alert("Add Posting")} sx={{ p: 1 }}>
            <AddIcon />
          </IconButton>
          <IconButton onClick={() => refetch()} sx={{ p: 1 }}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>
      <Box height="70vh">
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          loading={isLoading}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Postings;
