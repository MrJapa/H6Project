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
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// read a named cookie (for CSRF)
function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function AccountantForm() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyIds, setCompanyIds] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const queryClient = useQueryClient();

  // fetch companies for multi-select
  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8000/api/companies/", {
        credentials: "include",
      });
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // ensure CSRF cookie is set
  useEffect(() => {
    fetch("http://localhost:8000/api/csrf/", {
      credentials: "include",
    });
  }, []);

  const mutation = useMutation({
    mutationFn: async (vars) => {
      const csrfToken = getCookie("csrftoken");
      const res = await fetch("http://localhost:8000/api/accountants/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          first_name: vars.firstName,
          last_name: vars.lastName,
          username: vars.username,
          email: vars.email,
          password: vars.password,
          companies: vars.companyIds,
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
      queryClient.invalidateQueries({ queryKey: ["accountants"] });
      setFirstName("");
      setLastName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setCompanyIds([]);
      setSuccessMessage("Accountant created successfully!");
      setTimeout(() => setSuccessMessage(""), 5000); // Clear message after 5 seconds
    },
    onError: (error) => {
      setErrorMessage(error.message || "Failed to create accountant");
      setTimeout(() => setErrorMessage(""), 5000); // Clear message after 5 seconds
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      companyIds.length === 0
    ) {
      alert("All fields and at least one company are required.");
      return;
    }
    mutation.mutate({
      firstName,
      lastName,
      username,
      email,
      password,
      companyIds,
    });
  };

  return (
    <Box m="20px">
      <Header title="NEW ACCOUNTANT" subtitle="Create an accountant" />

      <Box display="flex" justifyContent="center" mt={2}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ maxWidth: 600, width: "100%" }}
        >
          {/* First + Last Name */}
          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>

          <Box mb={2}>
            <FormControl fullWidth>
              <InputLabel>Companies</InputLabel>
              <Select
                multiple
                value={companyIds}
                onChange={(e) => setCompanyIds(e.target.value)}
                input={<OutlinedInput label="Companies" />}
                renderValue={(selected) =>
                  companies
                    .filter((c) => selected.includes(c.id))
                    .map((c) => c.companyName)
                    .join(", ")
                }
              >
                {companies.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    <Checkbox checked={companyIds.includes(c.id)} />
                    <ListItemText primary={c.companyName} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Button
            type="submit"
            variant="contained"
            disabled={mutation.isLoading}
            sx={{ mt: 1 }}
            style={{
              backgroundColor: colors.primary,
              color: colors.text,
            }}
          >
            {mutation.isLoading ? "Creating…" : "Create Accountant"}
          </Button>
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
