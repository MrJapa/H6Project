//frontend/src/scenes/line/index.jsx
import React, {useState, useMemo, useContext} from "react";
import { 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  TextField, } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CompanyContext } from "../../state/CompanyContext";
import { useQuery } from "@tanstack/react-query";
import LineChartComponent from "../../components/LineChart";

const fetchPostings = async (companyId) => {
  const api = process.env.REACT_APP_API_URL;
  const url = new URL(`${api}/postings/`);
  if (companyId) url.searchParams.append("company", companyId);
  const res = await fetch(url.toString(), { method: "GET", credentials: "include" });
  return res.json();
};



const LineChartScene = () => {
  const { selectedCompany } = useContext(CompanyContext);
  const [accountHandleNumber, setAccountHandleNumber] = React.useState("");
  const [postDateRange, setPostDateRange] = React.useState([null, null]);
  const [suspiciousFilter, setSuspiciousFilter] = React.useState(false);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["postings", selectedCompany],
    queryFn: () => fetchPostings(selectedCompany),
    staleTime: Infinity,
  });

  // Get alle accounthandlenumbers options
  const accountHandleOptions = useMemo(() => {
    return Array.from(new Set(rows.map((r) => r.accountHandleNumber))).sort(
      (a, b) => a - b
    );
  }, [rows]);

  return (
    <Box m="20px">
      <h1>Postings Line Chart</h1>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" alignItems="center" mb={2} gap={2}>
      <FormControl sx={{ minWidth: 140 }}>
            <InputLabel id="account-handle-label">Account #</InputLabel>
            <Select
              labelId="account-handle-label"
              value={accountHandleNumber}
              label="Account #"
              onChange={(e) => setAccountHandleNumber(e.target.value)}
              disabled={isLoading}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {accountHandleOptions.map((num) => (
                <MenuItem key={num} value={String(num)}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        <DatePicker
          label="From"
          value={postDateRange[0]}
          onChange={newVal => setPostDateRange([newVal, postDateRange[1]])}
          renderInput={params => <TextField {...params} />}
        />
        <DatePicker
          label="To"
          value={postDateRange[1]}
          onChange={newVal => setPostDateRange([postDateRange[0], newVal])}
          renderInput={params => <TextField {...params} />}
        />
        <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="suspicious-filter-label">Suspicious?</InputLabel>
            <Select
              labelId="suspicious-filter-label"
              value={suspiciousFilter}
              label="Suspicious?"
              onChange={(e) => setSuspiciousFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="only">Only Suspicious</MenuItem>
              <MenuItem value="exclude">Exclude Suspicious</MenuItem>
            </Select>
          </FormControl>
      </Box>

      <LineChartComponent
        accountHandleNumber={accountHandleNumber}
        postDateRange={postDateRange}
        suspiciousFilter={suspiciousFilter}
      />
      </LocalizationProvider>
    </Box>
  );
};

export default LineChartScene;