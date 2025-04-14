import React, { useState, useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { Box, Button, Checkbox, Container, FormControlLabel, Grid, Link, Paper, TextField, Typography, useTheme } from "@mui/material";

export default function Login() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (event) => {
      event.preventDefault();

      console.log("Email:", email);
    };

    return (
      <Container
      component="main"
      maxWidth="xs"
      sx={{
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            backgroundColor: (theme.palette.mode === 'dark' ? colors.primary : colors.white),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          >
            <Typography variant="h4" sx={{ mb: 2 }} color={colors.text}>
              Sign In
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: '100%' }}>
            </Box>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              margin="normal"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember me"
              sx={{ mt: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid>
                <Link href="#" variant="body2" color={colors.text}>
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Paper>
      </Container>

    )
}

