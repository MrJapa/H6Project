// frontend/src/scenes/accountants/AccountantForm.jsx

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  OutlinedInput,
  Checkbox,
  ListItemText,
  List,
  ListItemButton,
  Typography
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fieldStyles } from "../../utils/styles";

// read a named cookie (for CSRF)
function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function AccountantForm() {
  const queryClient = useQueryClient();
  const api = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selected, setSelected] = useState(null);
  const emptyForm = {
    first_name: "", last_name: "",
    username: "", email: "",
    password: "", companies: [],
  };
  const [form, setForm] = useState(emptyForm);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // fetch companies for multi-select
  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await fetch(`${api}/companies/`, {
        credentials: "include",
      });
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: accountants = [], isLoading, error: loadError
  } = useQuery({
    queryKey: ["accountants"],
    queryFn: async () => {
      const res = await fetch(`${api}/accountants/`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load accountants");
      return res.json();
    },
  });


  // ensure CSRF cookie is set
  useEffect(() => {
    fetch(`${api}/csrf/`, {
      credentials: "include",
    });
  }, []);

  useEffect(() => {
    if (selected) {
      setForm({
        first_name: selected.first_name,
        last_name: selected.last_name,
        username: selected.username,
        email: selected.email,
        password: "",
        companies: selected.companies || [],
      });
    } else {
      setForm(emptyForm);
    }
  }, [selected]);

  const createMutation = useMutation({
    mutationFn: async (newAcc) => {
      const csrfToken = getCookie("csrftoken");
      const res = await fetch(`${api}/accountants/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          first_name: newAcc.firstName,
          last_name: newAcc.lastName,
          username: newAcc.username,
          email: newAcc.email,
          password: newAcc.password,
          companies: newAcc.companyIds,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(
          err.companies?.[0] ||
            err.first_name?.[0] ||
            err.last_name?.[0] ||
            err.username?.[0] ||
            err.email?.[0] ||
            err.detail ||
            "Failed to create accountant"
        );
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["accountants"]);
      setForm(emptyForm);
      setSelected(null);
      setSuccessMessage("Accountant created successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    },
    onError: (err) => {
      setErrorMessage(err.message || "Failed to create accountant");
      setTimeout(() => setErrorMessage(""), 5000);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (upd) => {
      const csrf = getCookie("csrftoken");
      const res = await fetch(`${api}/accountants/${selected.id}/`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf,
        },
        body: JSON.stringify(upd),
      });
      if (!res.ok) throw new Error("Failed to update accountant");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["accountants"]);
      setSuccessMessage("Accountant updated successfully!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000);
    },
    onError: (err) => {
      setErrorMessage(err.message || "Failed to update accountant");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 5000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const csrf = getCookie("csrftoken");
      const res = await fetch(`${api}/accountants/${selected.id}/`, {
        method: "DELETE",
        credentials: "include",
        headers: { "X-CSRFToken": csrf },
      });
      if (!res.ok) throw new Error("Failed to delete accountant");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["accountants"]);
      setSelected(null);
      setSuccessMessage("Accountant deleted successfully!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000);
    },
    onError: (err) => {
      setErrorMessage(err.message || "Failed to delete accountant");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 5000);
    },
  });

  if (isLoading) return <Typography>Loading accountants…</Typography>;
  if (loadError) return <Typography color="error">{loadError.message}</Typography>;


  return (
    <Box m="20px">
      <Header title="ACCOUNTANTS" subtitle="Manage your accountants" />
      <Box display="flex" height="calc(100% - 100px)" mt={2}>
        <Box
          width="200px"
          borderRight="1px solid #ddd"
          overflow="auto"
          p={1}
          height="50vh"
        >
          <Button
            fullWidth
            variant={selected === null ? "contained" : "text"}
            onClick={() => setSelected(null)}
          >
            + New Accountant
          </Button>
          <List>
            {accountants.map((a) => (
              <ListItemButton
                key={a.id}
                selected={selected?.id === a.id}
                onClick={() => setSelected(a)}
              >
                <ListItemText
                  primary={`${a.first_name} ${a.last_name}`}
                  secondary={a.username}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Box flexGrow={1} p={2}>
          {selected === null ? (
            <>
              {['first_name','last_name','username','email','password'].map((f) => (
                <TextField
                  key={f}
                  fullWidth
                  label={f.replace('_',' ').toUpperCase()}
                  type={f === 'password' ? 'password' : 'text'}
                  value={form[f]}
                  onChange={e => setForm(s => ({ ...s, [f]: e.target.value }))}
                  margin="normal"
                />
              ))}

              <FormControl fullWidth margin="normal" sx={fieldStyles(colors)}>
                <InputLabel sx={{ color: colors.blue, "&.Mui-focused": { color: colors.blue } }}>
                  Companies
                </InputLabel>
                <Select
                  multiple
                  value={form.companies}
                  onChange={e => setForm(s => ({ ...s, companies: e.target.value }))}
                  input={<OutlinedInput label="Companies" />}
                  renderValue={selectedIds =>
                    companies
                      .filter(c => selectedIds.includes(c.id))
                      .map(c => c.companyName)
                      .join(", ")
                  }
                >
                  {companies.map(c => (
                    <MenuItem key={c.id} value={c.id}>
                      <Checkbox checked={form.companies.includes(c.id)} />
                      <ListItemText primary={c.companyName} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box mt={2}>
                <Button
                  variant="contained"
                  disabled={createMutation.isLoading}
                  onClick={() => createMutation.mutate(form)}
                >
                  {createMutation.isLoading ? "Creating…" : "Create"}
                </Button>
              </Box>
            </>
          ) : (
            <>
              {['first_name','last_name','username','email'].map((f) => (
                <TextField
                  key={f}
                  fullWidth
                  label={f.replace('_',' ').toUpperCase()}
                  value={form[f]}
                  onChange={e => setForm(s => ({ ...s, [f]: e.target.value }))}
                  margin="normal"
                />
              ))}

              <FormControl fullWidth margin="normal" sx={fieldStyles(colors)}>
                <InputLabel sx={{ color: colors.blue, "&.Mui-focused": { color: colors.blue } }}>
                  Companies
                </InputLabel>
                <Select
                  multiple
                  value={form.companies}
                  onChange={e => setForm(s => ({ ...s, companies: e.target.value }))}
                  input={<OutlinedInput label="Companies" />}
                  renderValue={selectedIds =>
                    companies
                      .filter(c => selectedIds.includes(c.id))
                      .map(c => c.companyName)
                      .join(", ")
                  }
                >
                  {companies.map(c => (
                    <MenuItem key={c.id} value={c.id}>
                      <Checkbox checked={form.companies.includes(c.id)} />
                      <ListItemText primary={c.companyName} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box mt={2} display="flex" gap={2}>
                <Button
                  variant="contained"
                  disabled={updateMutation.isLoading}
                  onClick={() => updateMutation.mutate({
                    first_name: form.first_name,
                    last_name: form.last_name,
                    username: form.username,
                    email: form.email,
                    companies: form.companies,
                  })}
                >
                  {updateMutation.isLoading ? "Updating…" : "Update"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    if (window.confirm("Delete this accountant?"))
                      deleteMutation.mutate();
                  }}
                >
                  Delete
                </Button>
              </Box>
            </>
          )}

          {successMessage && <Box mt={2} color="green">{successMessage}</Box>}
          {errorMessage && <Box mt={2} color="red">{errorMessage}</Box>}
        </Box>
      </Box>
    </Box>
  );
}