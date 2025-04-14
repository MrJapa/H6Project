import { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Select, MenuItem as MuiMenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  return (
    <MenuItem
      active={selected === title}
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
    </MenuItem>
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
  const [companies, setCompanies] = useState([]); // Ensure companies is initialized as an empty array
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
          // Destructure user object
          const { username, email, role, companies } = data.user;
          setEmail(email);
          setUsername(username);
          setRole(role);
          setCompanies(companies || []);
          
          // If role is accountant and companies should have ids,
          // ensure that the companies array is in the correct object format.
          if (role === "accountant") {
            setSelectedCompanies(
              (companies || []).map((company) => {
                // Check if company is a string or an object
                return typeof company === "string" ? company : company.id;
              })
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
    <Box>
      <Sidebar collapsed={isCollapsed} style={{ height: "100vh" }} backgroundColor={colors.primary}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.purple,
            }}
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
          </MenuItem>

          {!isCollapsed && (
            <Box textAlign="center">
              {/* Display Company Name or Dropdown */}
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
                    // If company is a string, use it directly; if it's an object, use company.companyName
                    <MuiMenuItem key={index} value={typeof company === "string" ? company : company.id}>
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

              {/* Display Username */}
              <Typography variant="h5" color={colors.text} marginBottom="10px">
                {username}
              </Typography>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
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
              icon={<AccountBalanceOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default CustomSidebar;