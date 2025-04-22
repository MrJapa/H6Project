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
import AddPostingModal from "../../components/PostingModal";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import GetAppIcon from "@mui/icons-material/GetApp";
import { useQuery } from "@tanstack/react-query";
import { CompanyContext } from "../../state/CompanyContext";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

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
  
  const [addOpen, setAddOpen] = useState(false);

  const [selectionModel, setSelectionModel] = useState([]);

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

  useEffect(() => {
    setSelectionModel([]);
  }, [selectedCompany]);

  const handleSearch = (e) => setSearchText(e.target.value);

  const exportSelected = () => {
    if (selectionModel.length === 0) {
      alert("No rows selected!");
      return;
    }
    const headers = ["id","accountHandleNumber","postDescription","postAmount","postCurrency","postDate","is_suspicious"];
    const csvRows = [
      headers.join(","),
      ...filteredRows
        .filter((row) => selectionModel.includes(row.id))
        .map((row) =>
          headers
            .map((field) => {
              // wrap in quotes and escape quotes
              const val = row[field] ?? "";
              return `"${String(val).replace(/"/g, '""')}"`;
            })
            .join(",")
        ),
    ];
    const csvString = csvRows.join("\r\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "postings_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "accountHandleNumber", headerName: "Account", width: 100 },
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
      width: 120,
    },
    {
      field: "postCurrency",
      headerName: "Currency",
      headerAlign: "left",
      align: "left",
      width: 100,
    },
    {
      field: "postDate",
      headerName: "Date",
      headerAlign: "left",
      align: "left",
      width: 130,
    },
    {
      field: "is_suspicious",
      headerName: "Status",
      headerAlign: "left",
      align: "center",
      width: 100,
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

        <Box display="flex" alignItems="center">
          {/* Export */}
          <IconButton onClick={exportSelected} sx={{ p: 1 }} title="Export Selected">
            <GetAppIcon />
          </IconButton>
          {/* Add */}
          <IconButton onClick={() => setAddOpen(true)} sx={{ p: 1 }}>
            <AddIcon/>
          </IconButton>
          {/* Refresh */}
          <IconButton onClick={() => refetch()} sx={{ p: 1 }}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      <AddPostingModal
        open={addOpen}
        selectedCompany={selectedCompany}
        onClose={() => setAddOpen(false)}
        onSuccess={() => {
          setAddOpen(false);
          refetch();
        }}
      />

      <Box height="70vh">
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          loading={isLoading}
          checkboxSelection
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={(newModel) => {
            setSelectionModel(newModel);
          }}
          sx={{
            "& .MuiDataGrid-cellCheckbox .MuiCheckbox-root.Mui-checked": {
              color: colors.green,
            },
            "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root.Mui-checked": {
              color: colors.green,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Postings;
