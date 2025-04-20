// frontend/src/scenes/company/CompanyForm.jsx
import React, { useState, useEffect } from "react";
import { Box, TextField, Button, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
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
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [companyName, setCompanyName] = useState("");
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  // on mount, grab CSRF cookie
  useEffect(() => {
    fetch("http://localhost:8000/api/csrf/", {
      method: "GET",
      credentials: "include",
    });
  }, []);

  // the actual POST call
  const createCompany = async ({ companyName }) => {
    const csrfToken = getCookie("csrftoken");
    const res = await fetch("http://localhost:8000/api/companies/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({ companyName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to create company");
    }
    return res.json();
  };

  // v5 useMutation: single object signature
  // https://stackoverflow.com/questions/77205639/this-client-defaultmutationoptions-is-not-a-function-react-query-pocketbase-ne
  const mutation = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      setCompanyName("");
      setSuccessMessage("Company created successfully!");
      setTimeout(() => setSuccessMessage(""), 5000); // Clear message after 5 seconds
    },
    onError: (error) => {
      setErrorMessage(error.message || "Failed to create company");
      setTimeout(() => setErrorMessage(""), 5000); // Clear message after 5 seconds
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    mutation.mutate({ companyName: companyName.trim() });
  };

  return (
    <Box m="20px">
      <Header title="NEW COMPANY" subtitle="Add a new company" />
        <Box display="flex" justifyContent="center" mt={2}>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 600 }}>
            <Box display="flex" gap={2} mb={2}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 2, width: 400 }}
            >
              <TextField
                fullWidth
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                margin="normal"
                sx={fieldStyles(colors)}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={mutation.isLoading}
                style={{
                  backgroundColor: colors.primary[500],
                  color: colors.grey[100],
                }}
              >
                {mutation.isLoading ? "Creating…" : "Create Company"}
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
        </Box>
    </Box>
  );
};

export default CompanyForm;
