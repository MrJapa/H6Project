// frontend/src/scenes/global/Sidebar.jsx
import React, { useState, useEffect, useContext } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Select,
  Divider,
  MenuItem as MuiMenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { CompanyContext } from "../../state/CompanyContext";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PostAddIcon from "@mui/icons-material/PostAdd";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';


const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  "&& a.ps-menu-button": {
    transition: "background-color 0.3s",
  },
  "&& a.ps-menu-button:hover": {
    backgroundColor: `${tokens(theme.palette.mode).secondary} !important`,
    color: `${tokens(theme.palette.mode).purple}`,
  },
  "&&.active a.ps-menu-button": {
    color: `${tokens(theme.palette.mode).text} !important`,
    backgroundColor: `${tokens(theme.palette.mode).purple} !important`,
  },
}));

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  return (
    <StyledMenuItem
      className={selected === title ? "active" : ""}
      style={{ color: colors.white }}
      onClick={() => {
        setSelected?.(title);
        navigate(to);
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </StyledMenuItem>
  );
};

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}


const CustomSideBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { selectedCompany, setSelectedCompany } = useContext(CompanyContext);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [companies, setCompanies] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/user-details/", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isAuthenticated && data.user) {
          const { username, role, companies } = data.user;
          setUsername(username);
          setRole(role);
          setCompanies(companies || []);

          // if customer (only one), auto‑select
          if (role === "customer" && companies.length === 1) {
            setSelectedCompany(companies[0].id.toString());
          }
          // if accountant/superuser and no previous selection, default to first
          if (
            (role === "accountant" || role === "superuser") &&
            !selectedCompany &&
            companies.length > 0
          ) {
            setSelectedCompany(companies[0].id.toString());
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
  };

  const handleLogout = async () => {
    // 1) Ensure we have a fresh CSRF cookie
    await fetch("http://localhost:8000/api/csrf/", {
      method: "GET",
      credentials: "include",
    });

    // 2) Read it from the cookie
    const csrfToken = getCookie("csrftoken");

    // 3) Send logout with header
    await fetch("http://localhost:8000/api/logout/", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRFToken": csrfToken,
      },
    });

    // 4) Clear client auth and go to login
    localStorage.removeItem("authToken");
    navigate("/");
    window.location.reload();
  };

  return (
    <Sidebar
      collapsed={isCollapsed}
      style={{ height: "100vh" }}
      backgroundColor={colors.primary}
    >
      <Box display="flex" flexDirection="column" height="100%">
        <Menu iconShape="square">
          <StyledMenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{ margin: "10px 0 20px 0", color: colors.purple }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.purple}>
                  SafeLedger
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </StyledMenuItem>

          {!isCollapsed && (
            <Box textAlign="center" mb="10px">
              {(role === "accountant" || role === "superuser") && (
                <Select
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                  displayEmpty
                  sx={{
                    backgroundColor: colors.white,
                    color: colors.text,
                    width: "100%",
                  }}
                >
                  {companies.map((c) => (
                    <MuiMenuItem key={c.id} value={c.id.toString()}>
                      {c.companyName}
                    </MuiMenuItem>
                  ))}
                </Select>
              )}

              {(role === "customer" || companies.length === 1) && (
                <Typography
                  variant="h5"
                  color={colors.text}
                  sx={{ mt: 1 }}
                >
                  {companies[0]?.companyName || "No Company"}
                </Typography>
              )}

              <Typography variant="subtitle2" color={colors.text} mt="5px">
                {username}
              </Typography>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "0%"}>
            <Typography
              variant="h6"
              color={colors.purple}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Home
            </Typography>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.purple}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Postings"
              to="/postings"
              icon={<PostAddIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.purple}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Graphs
            </Typography>
            <Item
              title="Line Chart"
              to="/linechart"
              icon={<TimelineIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Bar Chart"
              to="/barchart"
              icon={<BarChartIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/piechart"
              icon={<PieChartIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {(role === "accountant" || role === "superuser") && (
              <>
              <Typography
                variant="h6"
                color={colors.purple}
                sx={{ m: "15px 0 5px 20px" }}>
              Administration
              </Typography>
              <Item
              title="Company Management"
              to="/companies/new"
              icon={<BusinessIcon />}
              selected={selected}
              setSelected={setSelected}
              />
              <Item
              title="Customer Management"
              to="/customers/new"
              icon={<PersonIcon />}
              selected={selected}
              setSelected={setSelected}
              />
              </>
            )}
            {(role === "superuser") && (
              <Item
                title="Accountant Management"
                to="/accountants/new"
                icon={<PersonIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
          </Box>
        </Menu>

        <Box sx={{ flexGrow: 1 }} />

        <Menu iconShape="square">
          <Divider />
          <Box paddingLeft={isCollapsed ? undefined : "0%"}>
            <Item
              title="Settings"
              to="/settings"
              icon={<SettingsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
          <Box paddingLeft={isCollapsed ? undefined : "0%"}>

          <StyledMenuItem
              onClick={handleLogout}
              style={{ color: colors.white }}
              icon={<LogoutIcon />}
            >
              <Typography>Logout</Typography>
            </StyledMenuItem>
          </Box>
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default CustomSideBar;
