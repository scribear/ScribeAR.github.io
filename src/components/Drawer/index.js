import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Options from "../TopSpace/Options";
import {ThemeProvider} from "@material-ui/core/styles";
import mytheme from './theme'
import blue from "@material-ui/core/colors/blue"
import orange from "@material-ui/core/colors/orange"
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useSelector , } from 'react-redux';
import ShareIcon from '@material-ui/icons/Share';
import {EmailShareButton} from 'react-share';
import Fade from '@material-ui/core/Fade';
import SaveIcon from '@material-ui/icons/SaveSharp';
import LogIn from "../LogIn/LogIn";
import MailIcon from '@material-ui/icons/Mail';
import { Button, Tooltip } from "@material-ui/core"
import Recognition from "../Captions/Recognition"
import AzureOption from '../AzureTopSpace/AzureOptions'
import MenuHider from '../PlaceHolder/MenuHider'
import './index.css'
import {prev_page, next_page} from '../../redux/actions'
import AudioOption from '../AudioOption';
import Switch from '../Switch';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import AROption from '../AROption'

const MenuMap = [
  'MainMenu',
  'Source',
  'Audio Visual',
];


const drawerWidth = (window.location.pathname === "/") ? '21vw':'80vw';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  show: {
    display: 'block',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaperO: {
    width: drawerWidth,
    background: orange[800],
  },
  drawerPaperB: {
    width: drawerWidth,
    background: blue[800],
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft(props) {
  const page = useSelector((state) => state.submenu);
  const shouldShow = useSelector((state) => state.meh);
  const classes = useStyles();
  const theme = useTheme();
  

  let pick = "detail_wrap active"
  if (shouldShow == 1){
    pick = "detail_wrap"
  }else{
    pick = "detail_wrap active"
  }


  var bgColor = props.color;
  var choice = "primary";
  if (bgColor === "black"){
    choice = "primary";
  }else{
    choice = "secondary";
  }
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAR = () => {
    window.location.replace('/armode')
  }

  const handleDesktop = () => {
    window.location.replace('/');
  }

  const renderOption = () => {
    if (window.location.pathname === '/armode'){
      return (
      <>
         <div className={classes.drawerHeader}>

          </div>
        <AROption />
      </>
      )
    }
    if (page === 1) {
      return (
        <>
          <div className={classes.drawerHeader}>
            <Switch page={page} prev={prev_page} next={next_page} titleMap={MenuMap} />
                  <IconButton onClick={handleDrawerClose} color = "inherit">
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                  </IconButton>

          </div>
          <Options />
        </>
      )
    }else if (page === 2){
      return (
        <>
          <div className={classes.drawerHeader}>
            <Switch page={page} prev={prev_page} next={next_page} titleMap={MenuMap} />
                  <IconButton onClick={handleDrawerClose} color = "inherit">
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                  </IconButton>

          </div>
          <AzureOption />
        </>
        
      )
    }
    return (
      <>
        <div className={classes.drawerHeader}>
          <Switch page={page} prev={prev_page} next={next_page} titleMap={MenuMap} />
                <IconButton onClick={handleDrawerClose} color = "inherit">
                  {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>

        </div>
        <AudioOption />
      </>
    )
  }

  const ARswitch = () => {
    if (window.location.pathname === '/armode') {
      return (
      <IconButton onClick={handleDesktop} color='inherit'>
          <DesktopWindowsIcon />
      </IconButton>
      )
    }
    return (
      <IconButton onClick={handleAR} color='inherit'>
        <VisibilityIcon />
      </IconButton> 
    )
  }

  return (
        <div className={classes.root}>
          <CssBaseline />
          <ThemeProvider theme = {mytheme}>
          <div className = {pick} >
            <AppBar
              position="fixed"
              className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
              }
              )}
              color = {choice}
            >
                <Toolbar >
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    className={clsx(classes.menuButton, open && classes.hide)}
                  >
                    <MenuIcon />
                  </IconButton>
                  <div className="border d-table w-100">
                  <h2 className="d-table-cell tar2">ScribeAR</h2>
                  <div className="d-table-cell tar">
                  <Button aria-controls="simple-menu" aria-haspopup="true" variant="contained" variant="text" color="inherit" onClick={handleClick} startIcon={<ShareIcon/>}>Share</Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <Tooltip TransitionComponent={Fade} title="Share through emails" arrow>
                    <MenuItem onClick={handleClose}>
                      <EmailShareButton subject="Transcript History">
                        <Button startIcon={<MailIcon/>}> EMAIL</Button>
                      </EmailShareButton>
                    </MenuItem>
                    </Tooltip>
                    <Tooltip TransitionComponent={Fade} title="Download the transcript as a .txt file" arrow>
                    <MenuItem onClick={handleClose}>
                      <Button variant="contained" variant="text" onClick={new Recognition().downloadTxtFile} startIcon={<SaveIcon fontSize='large'/>}>Download</Button>
                    </MenuItem>
                    </Tooltip>

                  </Menu>
                  <LogIn />
                  <ARswitch />

                  </div>
                  <div className='lock-wrap'>
                    <MenuHider />

                  </div>
              </div>
              </Toolbar>
            </AppBar>
          </div>
          {window.location.pathname === '/armode' ? 
          <Drawer
            className={classes.drawer}
            width = "50%"
            variant="temporary"
            anchor="left"
            open={open}
            classes = {{paper:classes.drawerPaper}}
            onClose={handleDrawerClose}
          >
            {renderOption()}
          </Drawer> :
          <Drawer
            className={classes.drawer}
            width = "50%"
            variant="persistent"
            anchor="left"
            open={open}
            classes = {{paper:classes.drawerPaper}}
          >
            {renderOption()}
          </Drawer>}
          <main
            className={clsx(classes.content, {
              [classes.contentShift]: open,
            })}
          >
            <div className={classes.drawerHeader} />

          </main>
          </ThemeProvider>
        </div>
    );
  }