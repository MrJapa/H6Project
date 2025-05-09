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
import Postings from "./scenes/postings";
import Login from "./scenes/login";
import CompanyForm from "./scenes/company";
import CustomerForm from "./scenes/customer";
import AccountantForm from "./scenes/accountant";
import BarChart from "./scenes/bar";
import LineChart from "./scenes/line";
import PieChart from "./scenes/pie";
import Retrain from "./scenes/retrain";

const queryClient = new QueryClient();
const api = process.env.REACT_APP_API_URL;


function App() {
  const [theme, colorMode] = useMode();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${api}/user-details/`, {
          method: "GET",
          credentials: "include",
          redirect: "follow",
        });
        if (res.status === 302 || res.redirected || !res.ok) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CompanyProvider>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {isAuthenticated ? (
              <div className="app">
                <CustomSideBar setIsAuthenticated={setIsAuthenticated}/>
                <main className="content">
                  <Topbar />
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/postings" element={<Postings />} />
                    <Route path="/companies/new" element={<CompanyForm />} />
                    <Route path="/customers/new" element={<CustomerForm />} />
                    <Route path="/accountants/new" element={<AccountantForm />} />
                    <Route path="/barchart" element={<BarChart />} />
                    <Route path="/linechart" element={<LineChart />} />
                    <Route path="/piechart" element={<PieChart />} />
                    <Route path="/retrain" element={<Retrain />} />
                    <Route path="/login" element={<Navigate to="/" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            ) : (
              <div className="app">
                <main className="content">
                  <TopbarTheme />
                  <Routes>
                    <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated}/>} />
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