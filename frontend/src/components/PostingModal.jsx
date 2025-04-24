import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  useTheme,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { tokens } from "../theme";
import { fieldStyles } from "../utils/styles";


export default function AddPostingModal({ open, onClose, onCreated, selectedCompany }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [accountHandleNumber, setAccountHandleNumber] = useState("");
  const [postAmount, setPostAmount] = useState("");
  const [postCurrency, setPostCurrency] = useState("");
  const [postDate, setPostDate] = useState(null);
  const [postDescription, setPostDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper to get CSRF token from cookies
  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp(
      `(^| )${name}=([^;]+)`
    ));
    return match ? match[2] : null;
  };

  const handleSubmit = async () => {
    setError("");
    if (!accountHandleNumber || !postAmount || !postCurrency || !postDate) {
      setError("All fields except description are required.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        company: selectedCompany,
        accountHandleNumber: parseInt(accountHandleNumber, 10),
        postAmount: parseFloat(postAmount),
        postCurrency,
        postDate: postDate.format("YYYY-MM-DD"),
        postDescription,
      };
      const csrfToken = getCookie("csrftoken");
      const api = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
      const res = await fetch(`${api}/postings/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create posting.");
      }
      const newPosting = await res.json();
      onCreated(newPosting);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ background: colors.secondary, color: colors.text }}>
          Add New Posting
        </DialogTitle>
        <DialogContent dividers sx={{ background: colors.primary }}>
          {error && (
            <Typography color={colors.red} variant="body2" gutterBottom>
              {error}
            </Typography>
          )}
          <TextField
            label="Account Handle Number"
            type="number"
            fullWidth
            margin="normal"
            value={accountHandleNumber}
            onChange={(e) => setAccountHandleNumber(e.target.value)}
            sx={fieldStyles(colors)}
          />
          <TextField
            label="Amount"
            type="number"
            fullWidth
            margin="normal"
            value={postAmount}
            onChange={(e) => setPostAmount(e.target.value)}
            sx={fieldStyles(colors)}
          />
          <TextField
            label="Currency"
            fullWidth
            margin="normal"
            value={postCurrency}
            onChange={(e) => setPostCurrency(e.target.value)}
            sx={fieldStyles(colors)}
          />
          <DatePicker
            label="Date"
            value={postDate}
            onChange={setPostDate}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
            sx={fieldStyles(colors)}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={2}
            value={postDescription}
            onChange={(e) => setPostDescription(e.target.value)}
            sx={fieldStyles(colors)}
          />
        </DialogContent>
        <DialogActions sx={{ background: colors.secondary }}>
          <Button onClick={onClose} disabled={loading} sx={{ color: colors.text }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} variant="contained">
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}