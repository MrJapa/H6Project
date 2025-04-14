// frontend/src/App.js
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate, BrowserRouter as Router } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import TopbarTheme from "./scenes/global/TopbarTheme";
import CustomSideBar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Form from "./scenes/form";
import Postings from "./scenes/postings";
import Login from "./scenes/login";


function App() {
  const [ theme, colorMode ] = useMode();

  const isAuthenticated = Boolean(localStorage.getItem("authToken"));

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isAuthenticated ? (
          <div className="app">
          <CustomSideBar/>
          <main className="content">
            <Topbar/>
            <Routes>
              <Route path="/" element={<Dashboard/>}/>
              <Route path="/postings" element={<Postings/>}/>
              <Route path="/form" element={<Form/>}/>
            </Routes>
          </main>
        </div>
        ) : (
          <div className="app">
            <main className="content">
            <TopbarTheme/>
            <Routes>
              <Route path="/" element={<Login/>}/>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </main>
          </div>
        )
        }
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App;
