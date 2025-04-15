import { Box, Typography, useTheme, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from '@mui/icons-material/Add';

const fetchPostings = async () => {
  const response = await fetch('http://localhost:8000/api/postings/', {
    method: 'GET',
    credentials: 'include', // Include cookies in the request
  });
  const data = await response.json();
  return data.map(item => ({
    ...item,
    id: item.id, // Ensure that every item has a unique "id" field.
  }));
};


const Postings = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { data: rows = [], isLoading } = useQuery({
      queryKey: ["postings"],
      queryFn: fetchPostings,
    });

    const [searchText, setSearchText] = useState("");
    const [filteredRows, setFilteredRows] = useState(rows);
  
    // Update filtered rows whenever rows or searchText changes
    React.useEffect(() => {
      setFilteredRows(
        rows.filter((row) =>
          Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchText.toLowerCase())
        )
      );
    }, [rows, searchText]);

    const handleSearch = (event) => {
      setSearchText(event.target.value);
    };

    // useEffect(() => {
    //     
    //     fetch('http://localhost:8000/api/postings/')
    //       .then(response => response.json())
    //       .then(data => {
    //         // Ensure that every item has a unique "id" field.
    //         const formattedData = data.map(item => ({
    //           ...item,
    //           id: item.id, // Django will usually provide an id if it’s the primary key.
    //         }));
    //         setRows(formattedData);
    //         setLoading(false);
    //       })
    //       .catch(error => {
    //         console.error('Error fetching postings:', error);
    //         setLoading(false);
    //       });
    //   }, []);

    const columns = [
        { field: "id", headerName: "ID" },
        { field: "accountHandleNumber", headerName: "Account" },
        { field: "postDescription", headerName: "Description", flex: 1, headerAlign: "left", align: "left" },
        { field: "postAmount", headerName: "Amount", type: "number", headerAlign: "left", align: "left" },
        { field: "postCurrency", headerName: "Currency", headerAlign: "left", align: "left"},
        { field: "postDate", headerName: "Date", headerAlign: "left", align: "left" },

    ];

    return (
    <Box m="20px">
        <Header title="POSTINGS" subtitle="Managing financial postings"/>
        <Box display="flex" justifyContent="space-between" marginBottom="15px">
            {/* SEARCH BAR */}
            <Box display="flex" backgroundColor={colors.primary} borderRadius="3px">
                <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search..." value={searchText} onChange={handleSearch} />
                <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
                </IconButton>
            </Box>
            <Box display="flex" alignItems="center" backgroundColor={colors.primary} borderRadius="3px"/>
            <Box display="flex">
                <IconButton onClick={() => alert('Add Posting')} sx={{ p: 1 }}>
                    <AddIcon />
                </IconButton>
            </Box>
        </Box>
        <Box m="0 0 0 0" height="70vh">
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
    )

}


export default Postings;
