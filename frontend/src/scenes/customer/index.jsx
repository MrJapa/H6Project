// frontend/src/scenes/customer/index.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "../../components/Header";


function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function CustomerManagement() {
  const api = process.env.REACT_APP_API_URL;
  const queryClient = useQueryClient();


  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await fetch(`${api}/companies/`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load companies");
      return res.json();
    },
  });


  const {
    data: customers = [],
    isLoading: loadingCustomers,
    error: loadError,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await fetch(`${api}/customers/`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load customers");
      return res.json();
    },
  });


  const [selected, setSelected] = useState(null);


  const emptyForm = { first_name: "", last_name: "", username: "", email: "", password: "", company: "" };
  const [form, setForm] = useState(emptyForm);


  useEffect(() => {
    if (selected) {
      setForm({
        first_name: selected.first_name,
        last_name: selected.last_name,
        username: selected.username,
        email: selected.email,
        password: "",
        company: selected.company || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [selected]);


  const createCustomer = useMutation({
    mutationFn: async (newCust) => {
      const csrf = getCookie("csrftoken");
      const res = await fetch(`${api}/customers/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf,
        },
        body: JSON.stringify(newCust),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.username?.[0] || err.email?.[0] || err.detail || "Failed to create customer");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      setForm(emptyForm);
      setSuccessMessage("Customer created successfully!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000);
    },
    onError: (err) => {
      setErrorMessage(err.message || "Failed to create customer");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 5000);
    },
  });

  const updateCustomer = useMutation({
    mutationFn: async (upd) => {
      const csrf = getCookie("csrftoken");
      const res = await fetch(`${api}/customers/${selected.id}/`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf,
        },
        body: JSON.stringify(upd),
      });
      if (!res.ok) throw new Error("Failed to update customer");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      setSuccessMessage("Customer updated successfully!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000);
    },
    onError: (err) => {
      setErrorMessage(err.message || "Failed to update customer");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 5000);
    },
  });

  const deleteCustomer = useMutation({
    mutationFn: async () => {
      const csrf = getCookie("csrftoken");
      const res = await fetch(`${api}/customers/${selected.id}/`, {
        method: "DELETE",
        credentials: "include",
        headers: { "X-CSRFToken": csrf },
      });
      if (!res.ok) throw new Error("Failed to delete customer");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      setSelected(null);
      setSuccessMessage("Customer deleted successfully!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000);
    },
    onError: (err) => {
      setErrorMessage(err.message || "Failed to delete customer");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 5000);
    },
  });

  if (loadingCustomers) return <Typography>Loading customers…</Typography>;
  if (loadError) return <Typography color="error">{loadError.message}</Typography>;

  return (
    <Box m="20px">
      <Header title="CUSTOMERS" subtitle="Manage your customers" />
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
            + New Customer
          </Button>
          <List>
            {customers.map((c) => (
              <ListItemButton
                key={c.id}
                selected={selected?.id === c.id}
                onClick={() => setSelected(c)}
              >
                <ListItemText
                  primary={`${c.first_name} ${c.last_name}`}
                  secondary={c.company_name || "—"}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Box flexGrow={1} p={2}>
          {selected === null ? (
            <>
              {['first_name','last_name','username','email','password'].map(f => (
                <TextField
                  key={f}
                  label={f.replace('_',' ').toUpperCase()}
                  type={f === 'password' ? 'password' : 'text'}
                  value={form[f]}
                  onChange={e => setForm(s => ({ ...s, [f]: e.target.value }))}
                  fullWidth
                  margin="normal"
                />
              ))}
              <FormControl fullWidth margin="normal">
                <InputLabel>Company</InputLabel>
                <Select
                  value={form.company}
                  onChange={e => setForm(s => ({ ...s, company: e.target.value }))}
                  label="Company"
                >
                  {companies.map(c => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.companyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box mt={2}>
                <Button
                  variant="contained"
                  onClick={() => createCustomer.mutate({
                    first_name: form.first_name,
                    last_name: form.last_name,
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    company: form.company,
                  })}
                  disabled={createCustomer.isLoading}
                >
                  {createCustomer.isLoading ? "Creating…" : "Create"}
                </Button>
              </Box>
            </>
          ) : (
            <>
              {['first_name','last_name','username','email'].map(f => (
                <TextField
                  key={f}
                  label={f.replace('_',' ').toUpperCase()}
                  value={form[f]}
                  onChange={e => setForm(s => ({ ...s, [f]: e.target.value }))}
                  fullWidth
                  margin="normal"
                />
              ))}
              <Box mt={2} display="flex" gap={2}>
                <Button
                  variant="contained"
                  onClick={() => updateCustomer.mutate({
                    first_name: form.first_name,
                    last_name: form.last_name,
                    username: form.username,
                    email: form.email,
                  })}
                  disabled={updateCustomer.isLoading}
                >
                  {updateCustomer.isLoading ? "Updating…" : "Update"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    if (window.confirm("Delete this customer?"))
                      deleteCustomer.mutate();
                  }}
                >
                  Delete
                </Button>
              </Box>
            </>
          )}
          {successMessage && (
            <Box mt={2} color="green">
              {successMessage}
            </Box>
          )}
          {errorMessage && (
            <Box mt={2} color="red">
              {errorMessage}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
