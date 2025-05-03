// frontend/src/scenes/company/CompanyForm.jsx
import React, { useState, useEffect } from "react";
import { Box, TextField, Button, useTheme, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fieldStyles } from "../../utils/styles";

// helper to read cookie
function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

const CompanyForm = () => {
  const api = process.env.REACT_APP_API_URL;
  const queryClient = useQueryClient();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // on mount, grab CSRF cookie
  useEffect(() => {
    fetch(`${api}/csrf/`, {
      method: "GET",
      credentials: "include",
    });
  }, []);

  const { data: companies = [], isLoading, error: loadError } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await fetch(`${api}/companies/`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load companies");
      return res.json();
    },
  });

  useEffect(() => {
    if (selected) {
      setCompanyName(selected.companyName);
    } else {
      setCompanyName("");
    }
  }, [selected]);

  const createMutation = useMutation({
    mutationFn: async ({ name }) => {
      const csrf = getCookie("csrftoken");
      const res = await fetch(`${api}/companies/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf,
        },
        body: JSON.stringify({ companyName: name }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to create company");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["companies"]);
      setCompanyName("");
      setSelected(null);
      setSuccessMessage("Company created successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    },
    onError: (err) => {
      setErrorMessage(err.message || "Failed to create company");
      setTimeout(() => setErrorMessage(""), 5000);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ name }) => {
      const csrf = getCookie("csrftoken");
      const res = await fetch(`${api}/companies/${selected.id}/`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf,
        },
        body: JSON.stringify({ companyName: name }),
      });
      if (!res.ok) throw new Error("Failed to update company");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["companies"]);
      setSuccessMessage("Company updated successfully!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000);
    },
    onError: (err) => {
      setErrorMessage(err.message || "Failed to update company");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 5000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const csrf = getCookie("csrftoken");
      const res = await fetch(`${api}/companies/${selected.id}/`, {
        method: "DELETE",
        credentials: "include",
        headers: { "X-CSRFToken": csrf },
      });
      if (!res.ok) throw new Error("Failed to delete company");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["companies"]);
      setSelected(null);
      setSuccessMessage("Company deleted successfully!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000);
    },
    onError: (err) => {
      setErrorMessage(err.message || "Failed to delete company");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 5000);
    },
  });

  if (isLoading) return <Typography>Loading companies…</Typography>;
  if (loadError) return <Typography color="error">{loadError.message}</Typography>;

  return (
    <Box m="20px">
      <Header title="COMPANIES" subtitle="Manage your companies" />
      <Box display="flex" height="calc(100% - 100px)" mt={2}>
        <Box width="200px" borderRight="1px solid #ddd" overflow="auto" p={1} height="50vh">
          <Button
            fullWidth
            variant={selected === null ? "contained" : "text"}
            onClick={() => setSelected(null)}
          >
            + New Company
          </Button>
          <List>
            {companies.map((c) => (
              <ListItemButton
                key={c.id}
                selected={selected?.id === c.id}
                onClick={() => setSelected(c)}
              >
                <ListItemText primary={c.companyName} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Box flexGrow={1} p={2}>
          <TextField
            fullWidth
            label="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            sx={fieldStyles(colors)}
            margin="normal"
          />

          {selected === null ? (
            <Button
              variant="contained"
              onClick={() => createMutation.mutate({ name: companyName.trim() })}
              disabled={createMutation.isLoading || !companyName.trim()}
            >
              {createMutation.isLoading ? "Creating…" : "Create"}
            </Button>
          ) : (
            <Box display="flex" gap={2} mt={2}>
              <Button
                variant="contained"
                onClick={() => updateMutation.mutate({ name: companyName.trim() })}
                disabled={updateMutation.isLoading || !companyName.trim()}
              >
                {updateMutation.isLoading ? "Updating…" : "Update"}
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  if (window.confirm("Delete this company?")) deleteMutation.mutate();
                }}
              >
                Delete
              </Button>
            </Box>
          )}

          {successMessage && <Box mt={2} color="green">{successMessage}</Box>}
          {errorMessage && <Box mt={2} color="red">{errorMessage}</Box>}
        </Box>
      </Box>
    </Box>
  );
}

export default CompanyForm;
