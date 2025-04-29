import React, { useState } from "react";
import {
  Box, Button, Typography, MenuItem,
  Select, FormControl, InputLabel, Alert
} from "@mui/material";
import Header from "../../components/Header";
import { useQuery } from "@tanstack/react-query";

function getCookie(name) {
  const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return m ? m[2] : null;
}

export default function Retrain() {
  const api = process.env.REACT_APP_API_URL;
  const [companyId, setCompanyId] = useState("");
  const [msg, setMsg] = useState(null);

  // fetch companies for the dropdown
  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await fetch(`${api}/companies/`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load companies");
      return res.json();
    },
  });

  const handleRetrain = async () => {
    if (!window.confirm(
        companyId
        ? "Retrain model for this company?"
        : "Retrain model for ALL companies?"
    )) return;

    try {
      const csrf = getCookie("csrftoken");
      const res = await fetch(`${api}/retrain-ml/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf,
        },
        body: companyId ? JSON.stringify({ company_id: companyId }) : JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Retrain failed");
      setMsg({ type: "success", text: data.message });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
  };

  return (
    <Box m="20px">
      <Header title="RETRAIN MODEL" subtitle="Per-company ML retraining" />
      <Box mt={4} maxWidth={400}>
        <FormControl fullWidth>
          <InputLabel>Company</InputLabel>
          <Select
            value={companyId}
            label="Company"
            onChange={(e) => setCompanyId(e.target.value)}
          >
            <MenuItem value="">
             <em>All Companies</em>
           </MenuItem>
            {companies.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.companyName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box mt={2}>
        <Button variant="contained" onClick={handleRetrain}>
           Retrain Model
         </Button>
        </Box>
        {msg && (
          <Box mt={2}>
            <Alert severity={msg.type}>{msg.text}</Alert>
          </Box>
        )}
      </Box>
    </Box>
  );
}
