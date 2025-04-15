import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

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
        { field: "postDate", headerName: "Date", type: "Date", headerAlign: "left", align: "left" },

    ];

    return (
    <Box m="20px">
        <Header title="POSTINGS" subtitle="Managing financial postings"/>
        <Box m="40px 0 0 0" height="75vh">
          <DataGrid
          rows={rows}
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
