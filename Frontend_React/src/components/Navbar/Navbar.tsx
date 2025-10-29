import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useTheme } from "@mui/material/styles";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

export default function Navbar() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const links = [
    { label: "Recetas", path: "/recetas" },
    { label: "Agenda", path: "/agenda" },
    { label: "Juego", path: "/juego" },
    { label: "Calculadora IMC", path: "/imc" },
  ];

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        color: "#17252a",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* LOGO */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "#2b7a78",
            cursor: "pointer",
            "&:hover": { color: "#3aafa9" },
          }}
          onClick={() => navigate("/")}
        >
          NutriApp 🥗
        </Typography>

        {/* LINKS + USER/AUTH (Desktop) */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {links.map((link) => (
              <Button
                key={link.path}
                component={RouterLink}
                to={link.path}
                sx={{
                  color: location.pathname === link.path ? "#2b7a78" : "#17252a",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                  height: "48px",
                  borderRadius: "10px",
                  "&:hover": { color: "#2b7a78", backgroundColor: "transparent" },
                }}
              >
                {link.label}
              </Button>
            ))}

            {/* USER / AUTH */}
            {user ? (
              <>
                <IconButton
                  onClick={handleMenu}
                  sx={{
                    color: "#2b7a78",
                    "&:hover": { color: "#3aafa9" },
                  }}
                >
                  <AccountCircle fontSize="large" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      mt: 1,
                    },
                  }}
                >
                  <MenuItem disabled sx={{ opacity: 1, fontWeight: 600 }}>
                    {user}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#2b7a78",
                    "&:hover": { backgroundColor: "#3aafa9" },
                    textTransform: "none",
                    fontWeight: 600,
                    height: "48px",
                    borderRadius: "10px",
                  }}
                  onClick={() => navigate("/login")}
                >
                  Iniciar sesión
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "#2b7a78",
                    color: "#2b7a78",
                    "&:hover": {
                      backgroundColor: "#2b7a78",
                      color: "white",
                      borderColor: "#2b7a78",
                    },
                    textTransform: "none",
                    fontWeight: 600,
                    height: "48px",
                    borderRadius: "10px",
                  }}
                  onClick={() => navigate("/register")}
                >
                  Registrarse
                </Button>
              </>
            )}
          </Box>
        )}

        {/* MENU ICON (Mobile) */}
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon sx={{ color: "#2b7a78" }} />
          </IconButton>
        )}
      </Toolbar>

      {/* DRAWER (Mobile menu) */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: "#2b7a78",
            }}
          >
            Menú
          </Typography>
          <List>
            {links.map((link) => (
              <ListItem
                button
                key={link.path}
                component={RouterLink}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 2 }}>
            {!user ? (
              <>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mb: 1,
                    backgroundColor: "#2b7a78",
                    "&:hover": { backgroundColor: "#3aafa9" },
                  }}
                  onClick={() => {
                    navigate("/login");
                    setDrawerOpen(false);
                  }}
                >
                  Iniciar sesión
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderColor: "#2b7a78",
                    color: "#2b7a78",
                    "&:hover": {
                      backgroundColor: "#2b7a78",
                      color: "white",
                      borderColor: "#2b7a78",
                    },
                  }}
                  onClick={() => {
                    navigate("/register");
                    setDrawerOpen(false);
                  }}
                >
                  Registrarse
                </Button>
              </>
            ) : (
              <>
                <Typography
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    textAlign: "center",
                    color: "#2b7a78",
                  }}
                >
                  {user}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={() => {
                    handleLogout();
                    setDrawerOpen(false);
                  }}
                >
                  Cerrar sesión
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
