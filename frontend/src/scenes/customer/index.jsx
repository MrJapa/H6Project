// frontend/src/scenes/customers/CustomerForm.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  useTheme,
  InputLabel,
  FormControl,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// read a named cookie (for CSRF)
function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function CustomerForm() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyId, setCompanyId] = useState("");
  const queryClient = useQueryClient();

  // fetch companies for the dropdown
  const { data: companies = [], isLoading: loadingCompanies } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8000/api/companies/", {
        credentials: "include",
      });
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // grab CSRF token on mount
  useEffect(() => {
    fetch("http://localhost:8000/api/csrf/", {
      credentials: "include",
    });
  }, []);

  // mutation to POST new customer
  const mutation = useMutation({
    mutationFn: async ({firstName, lastName, username, email, password, companyId }) => {
      const csrfToken = getCookie("csrftoken");
      const res = await fetch("http://localhost:8000/api/customers/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          password,
          company: companyId,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(
          err.username?.[0] ||
            err.email?.[0] ||
            err.detail ||
            "Failed to create customer"
        );
      }
      return res.json();
    },
    onSuccess: () => {
      // invalidate any customer lists
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      // reset form
      setFirstName("");
      setLastName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setCompanyId("");
      alert("Customer created!");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !email || !password || !companyId) {
      alert("All fields are required.");
      return;
    }
    mutation.mutate({firstName, lastName, username, email, password, companyId });
  };

  return (
    <Box m="20px">
        <Header title="NEW CUSTOMER" subtitle="Create a new customer"/>
        <Box display="flex" justifyContent="center" mt={2}>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 600 }}>
                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Box mb={2}>
                    <FormControl fullWidth>
                        <InputLabel>Company</InputLabel>
                        <Select
                            value={companyId}
                            onChange={(e) => setCompanyId(e.target.value)}
                            label="Company"
                        >
                            {companies.map((c) => (
                                <MenuItem key={c.id} value={c.id}>
                                    {c.companyName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={mutation.isLoading}
            sx={{ mt: 1 }}
            style={{
              backgroundColor: colors.primary[500],
              color: colors.grey[100],
            }}
          >
            {mutation.isLoading ? "Creating…" : "Create Customer"}
          </Button>
            </Box>
        </Box>
    </Box>
  );
}
