import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import PaletteIcon from '@mui/icons-material/Palette';
import ThemeOption from './themeOption'
import { ThemeProvider } from '@mui/material/styles';
import Theme from './../../theme'

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { myTheme } = Theme()
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <ThemeProvider theme={myTheme}>

          <Button
            id="demo-customized-button"
            variant="contained"
            disableElevation
            onClick={handleClick}
            sx={{ width: 50, height: 30 }}
          >
            {<PaletteIcon />}

          </Button>
        </ThemeProvider>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            height: '14vw',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            '& .MuiAvatar-root': {
              boxSizing: "border-box",
              mr: 1,
            },

          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'center' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'center' }}
      >
        <ThemeOption />
      </Menu>
    </React.Fragment>
  );
}
