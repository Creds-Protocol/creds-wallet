import * as React from 'react';
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
import AdbIcon from '@mui/icons-material/Adb';
import Logo from '../assets/logo.jpeg';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from 'react-router-dom';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" style={{backgroundColor:"white"}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img src={Logo} style={{width:"4%", padding:"0.5%" }}/>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 300,
              letterSpacing: '.1rem',
              color: '#41DCF5',
              textDecoration: 'none',
            }}
          >
            CREDSWALLET
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Link to="/user" style={{ textDecoration: 'none' }} >
              <Button
                onClick={handleCloseNavMenu}
                sx={{ my: 3, color: '#41DCF5', display: 'block' }}
              >
                User
              </Button>
            </Link>
            <Link to="/issuer" style={{ textDecoration: 'none' }} >
              <Button
                onClick={handleCloseNavMenu}
                sx={{ my: 3, color: '#41DCF5', display: 'block' }}
              >
                Issuer
              </Button>
            </Link>
            <Link to="/verifier" style={{ textDecoration: 'none' }} >
              <Button
                onClick={handleCloseNavMenu}
                sx={{ my: 3, color: '#41DCF5', display: 'block' }}
              >
                Verifier
              </Button>
            </Link>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
