import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Options from "../TopSpace/Options";
import {ThemeProvider} from "@material-ui/core/styles";
import mytheme from './theme'
import blue from "@material-ui/core/colors/blue"
import orange from "@material-ui/core/colors/orange"
import ButtomNavi from '../ButtomNavi'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {useSelector,useDispatch} from 'react-redux';
import PopMenu from '../PopMenu'
import AzureOption from '../AzureTopSpace/AzureOptions'
import MenuSwitch from '../PopMenu/MenuSwitch'
import MenuHider from '../PlaceHolder/MenuHider'
import './index.css'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {prev_page, next_page} from '../../redux/actions'
import AudioOption from '../AudioOption';
const drawerWidth = '21vw';//drawer width

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
    // necessary for content to be below app bar
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
  const submenu = (state) => state.submenu;
  const menuhide = (state) => state.meh;
  const dispatch = useDispatch();
  const setting = useSelector(submenu);
  const shouldShow = useSelector(menuhide);

  var hiddenText = ''
  var pick = "detail_wrap"
  if (shouldShow == 0){
    pick += '.active'
    hiddenText = 'visible'
  }else{
    pick = 'detail_wrap'
    hiddenText = 'auto-hide'
  }
  

  const classes = useStyles();
  const theme = useTheme();
  var bgColor = props.color;
  var choice = "primary";
  if (bgColor == "black"){
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

  if (setting == 1){
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

                <Typography variant="h6" noWrap>
                  Welcome to ScribeAR
                </Typography>
                <div className='lock-wrap'>
                  <MenuHider />
                  <div className = 'hidden-text'>
                    {hiddenText}
                  </div>
                </div>
                
              </Toolbar>

            </AppBar>
          </div>
          <Drawer
            className={classes.drawer}
            width = "50%"
            variant="persistent"
            anchor="left"
            open={open}
            classes = {{paper:classes.drawerPaper}}
          >
            <div className={classes.drawerHeader}>
              <MenuSwitch title = 'MainMenu' left = {prev_page} right={next_page}/>
              <PopMenu />
              <IconButton onClick={handleDrawerClose} color = "inherit">
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>

            </div>
            <Options />
          </Drawer>
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
  }else if (setting == 2){
    return (
        <div className={classes.root}>
        <CssBaseline />
        <ThemeProvider theme = {mytheme}>
        <div className = {pick}>
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
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
              <Typography variant="h6" noWrap>
                Welcome to ScribeAR
              </Typography>
              <div className='lock-wrap'>
                 <MenuHider />
                <div className = 'hidden-text'>
                    {hiddenText}
                </div>
              </div>
            </Toolbar>
          </AppBar>
        </div>

        <Drawer
          className={classes.drawer}
          width = "50%"
          variant="persistent"
          anchor="left"
          open={open}
          classes = {{paper:classes.drawerPaper}}
        >
          <div className={classes.drawerHeader}>
          <MenuSwitch title = 'Azure' left = {prev_page} right={next_page}/>
            <PopMenu />
            <IconButton onClick={handleDrawerClose} color = "inherit">
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>

          </div>
          <AzureOption />
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />

        </main>
        </ThemeProvider>
        </div>
    )
  }else{
    return(
      <div className={classes.root}>
      <CssBaseline />
      <ThemeProvider theme = {mytheme}>
      <div className = {pick}>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
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
            <Typography variant="h6" noWrap>
              Welcome to ScribeAR
            </Typography>
            <div className='lock-wrap'>
               <MenuHider />
              <div className = 'hidden-text'>
                  {hiddenText}
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </div>

      <Drawer
        className={classes.drawer}
        width = "50%"
        variant="persistent"
        anchor="left"
        open={open}
        classes = {{paper:classes.drawerPaper}}
      >
        <div className={classes.drawerHeader}>
        <MenuSwitch title = 'AudioV' left = {prev_page} right={next_page}/>
          <PopMenu />
          <IconButton onClick={handleDrawerClose} color = "inherit">
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>

        </div>
        <AudioOption />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />

      </main>
      </ThemeProvider>
      </div>
    )
  } 
}
