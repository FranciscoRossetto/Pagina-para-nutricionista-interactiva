// src/components/Navbar/Navbar.tsx
import { useState } from "react";
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
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

interface User {
  name: string;
  email?: string;
  avatar?: string;
}

export default function Navbar() {
  const { user, logout } = useUser() as { user: User | null; logout: () => void };
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

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    handleClose();
    setDrawerOpen(false);
    navigate("/");
  };

  // links
  const renderLinks = () =>
    links.map((link) => (
      <Button
        key={link.path}
        component={RouterLink}
        to={link.path}
        sx={{
          color: location.pathname === link.path ? "primary.main" : "text.primary",
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        {link.label}
      </Button>
    ));

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          color: "#17252a",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
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

          {/* links y auth */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {renderLinks()}
              {user ? (
                <>
                  <IconButton onClick={handleMenu}>
                    <Avatar src={user.avatar} alt={user.name} />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    <MenuItem disabled>{user.name}</MenuItem>
                    <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    sx={{ textTransform: "none", fontWeight: 600 }}
                    onClick={() => navigate("/login")}
                  >
                    Iniciar sesión
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ textTransform: "none", fontWeight: 600 }}
                    onClick={() => navigate("/register")}
                  >
                    Registrarse
                  </Button>
                </>
              )}
            </Box>
          )}

          {/* adaptacion */}
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon sx={{ color: "#2b7a78" }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* adaptacion */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <List>
            {links.map((link) => (
              <ListItem
                key={link.path}
                component={RouterLink}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "rgba(43,122,120,0.1)" },
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    color: location.pathname === link.path ? "primary.main" : "text.primary",
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            {!user ? (
              <>
                <Button
                  fullWidth
                  variant="contained"
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
                <Typography sx={{ fontWeight: 600, textAlign: "center" }}>{user.name}</Typography>
                <Button fullWidth variant="contained" color="error" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
