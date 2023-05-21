import * as React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { UserContext } from "./static/UserContext";

function Navbar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const {user, userLogout} = React.useContext(UserContext);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    userLogout();
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Ícone (logo) */}
          <AssessmentIcon
            sx={{
              color: 'white',
              display: { xs: 'none', md: 'flex' },
              mr: 1
            }}
            />

          {/* Nome (logo) */}
          <Link to="/">
            <Typography
              variant="h6"
              noWrap
              component="p"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Análises
            </Typography>
          </Link>

          {/* Botões do Lado Esquerdo */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {user && user.permissions.create_users && (
              <Link to="/users">
                <Button
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    Utilizadores
                </Button>
              </Link>
            )}
            {user && user.permissions.view_forms && (
              <Link to="/forms">
                <Button
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    Forms
                </Button>
              </Link>
            )}
            {user && user.permissions.view_fhir && (
              <Link to="/fhir">
                <Button
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    Fhir
                </Button>
              </Link>
            )}
          </Box>

          {/* Botões do Lado Direito */}
          <Box sx={{ flexGrow: 0 }}>
            { user
              ?
              <div>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  <Button
                      sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                      Olá, { user.name }
                  </Button>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem>
                      <Typography textAlign="center">Perfil</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              </div> 
              :
              <Link to="/login">
                <Button
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    Login
                </Button>
              </Link>
            }
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;