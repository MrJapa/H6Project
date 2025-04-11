import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOulinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import { use } from "react";


const Postings = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Replace the URL with your Django API endpoint
        fetch('http://localhost:8000/api/postings/')
          .then(response => response.json())
          .then(data => {
            // Ensure that every item has a unique "id" field.
            const formattedData = data.map(item => ({
              ...item,
              id: item.id, // Django will usually provide an id if it’s the primary key.
            }));
            setRows(formattedData);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching postings:', error);
            setLoading(false);
          });
      }, []);

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
          loading={loading}
          checkboxSelection
          />
        </Box>
    </Box>
    )

}


export default Postings;
