// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CompanyProvider } from "./state/CompanyContext";

import Topbar from "./scenes/global/Topbar";
import TopbarTheme from "./scenes/global/TopbarTheme";
import CustomSideBar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Form from "./scenes/form";
import Postings from "./scenes/postings";
import Login from "./scenes/login";
import CompanyForm from "./scenes/company";

const queryClient = new QueryClient();

function App() {
  const [theme, colorMode] = useMode();
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("authToken"))
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("authToken")));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CompanyProvider>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {isAuthenticated ? (
              <div className="app">
                <CustomSideBar />
                <main className="content">
                  <Topbar />
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/postings" element={<Postings />} />
                    <Route path="/form" element={<Form />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/companies/new" element={<CompanyForm />} />
                  </Routes>
                </main>
              </div>
            ) : (
              <div className="app">
                <main className="content">
                  <TopbarTheme />
                  <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            )}
          </ThemeProvider>
        </ColorModeContext.Provider>
      </CompanyProvider>
    </QueryClientProvider>
  );
}

export default App;