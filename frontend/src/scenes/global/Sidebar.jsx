import { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Select, Divider, MenuItem as MuiMenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutline';
import TimelineIcon from '@mui/icons-material/Timeline';
import PostAddIcon from '@mui/icons-material/PostAdd';

// Create a styled version of MenuItem that uses your theme's tokens for hover and active states.
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

// Item component: adds an "active" class if the item is selected.
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  
  return (
    <StyledMenuItem
      className={selected === title ? "active" : ""}
      style={{
        color: colors.white,
      }}
      onClick={() => {
        setSelected(title);
        navigate(to);
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </StyledMenuItem>
  );
};

const CustomSidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  // Fetch user details on component mount
  useEffect(() => {
    fetch("http://localhost:8000/api/user-details/", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isAuthenticated && data.user) {
          const { username, email, role, companies } = data.user;
          setEmail(email);
          setUsername(username);
          setRole(role);
          setCompanies(companies || []);
          if (role === "accountant") {
            setSelectedCompanies(
              (companies || []).map((company) =>
                typeof company === "string" ? company : company.id
              )
            );
          }
        }
      })
      .catch((error) => console.error("Error fetching user details:", error));
  }, []);

  const handleCompanyChange = (event) => {
    setSelectedCompanies(event.target.value);
  };

  return (
    <Sidebar collapsed={isCollapsed} style={{ height: "100vh" }} backgroundColor={colors.primary}>
      <Box display="flex" flexDirection="column" height="100%">
        <Menu iconShape="square">
          {/* LOGO / Collapse Toggle */}
          <StyledMenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.purple,
            }}
          >
            {!isCollapsed && (
              <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
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
            <Box textAlign="center">
              {role === "accountant" ? (
                <Select
                  multiple
                  value={selectedCompanies}
                  onChange={handleCompanyChange}
                  displayEmpty
                  sx={{
                    backgroundColor: colors.white,
                    color: colors.text,
                    marginBottom: "10px",
                  }}
                >
                  {companies.map((company, index) => (
                    <MuiMenuItem
                      key={index}
                      value={typeof company === "string" ? company : company.id}
                    >
                      {typeof company === "string" ? company : company.companyName}
                    </MuiMenuItem>
                  ))}
                </Select>
              ) : (
                <Typography
                  variant="h2"
                  color={colors.text}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {companies.length > 0 ? (typeof companies[0] === "string" ? companies[0] : companies[0].companyName) : "No Company"}
                </Typography>
              )}

              <Typography variant="h5" color={colors.text} marginBottom="10px">
                {username}
              </Typography>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "0%"}>
            <Typography variant="h6" color={colors.purple} sx={{ m: "15px 0 5px 20px" }}>
              Home
            </Typography>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography variant="h6" color={colors.purple} sx={{ m: "15px 0 5px 20px" }}>
              Data
            </Typography>
            <Item
              title="Postings"
              to="/postings"
              icon={<PostAddIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography variant="h6" color={colors.purple} sx={{ m: "15px 0 5px 20px" }}>
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              to="/"
              icon={<BarChartIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/"
              icon={<PieChartOutlineIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/"
              icon={<TimelineIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>

        {/* Spacer to push bottom items down */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Bottom Menu for Settings */}
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
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default CustomSidebar;
