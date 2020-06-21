import React from 'react';
import clsx from 'clsx';
import store from '../../store'
import './index.css';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Options from "../TopSpace/Options";
import {ThemeProvider} from "@material-ui/core/styles";
import { Button } from "@material-ui/core"
import Recognition from "../Captions/Recognition"
import AzureRecognition from "../AzureCaptions/AzureRecognition"
import mytheme from './theme'
import blue from "@material-ui/core/colors/blue"
import orange from "@material-ui/core/colors/orange"
import ButtomNavi from '../ButtomNavi'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {useSelector,useDispatch} from 'react-redux';
import { submenu1,submenu2 } from '../../redux/actions';
import PopMenu from '../PopMenu'

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
  const dispatch = useDispatch();
  const setting = useSelector(submenu);

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
  // if (store.isSuccessReducer == 'success') {
  //   if (setting == 1){
  //     return (
  //         <div className={classes.root}>
  //           <CssBaseline />
  //           <ThemeProvider theme = {mytheme}>
  //           <AppBar
  //             position="fixed"
  //             className={clsx(classes.appBar, {
  //               [classes.appBarShift]: open,
  //             })}
  //             color = {choice}
  //           >
  //             <Toolbar >
  //               <IconButton
  //                 color="inherit"
  //                 aria-label="open drawer"
  //                 onClick={handleDrawerOpen}
  //                 edge="start"
  //                 className={clsx(classes.menuButton, open && classes.hide)}
  //               >
  //                 <MenuIcon />
  //               </IconButton>
  //               <div class="border d-table w-100">
  //           <h2 class="d-table-cell tar2">Welcome to ScribeAR</h2>
  //           <div class="d-table-cell tar">
  //             <Button variant="contained" variant="text" color="secondary" onClick={new AzureRecognition().downloadTxtFile} startIcon={<SaveAltIcon/>}>Download transcript</Button>
  //           </div>
  //         </div>
  //             </Toolbar>
  //           </AppBar>
  //
  //           <Drawer
  //             className={classes.drawer}
  //             width = "50%"
  //             variant="persistent"
  //             anchor="left"
  //             open={open}
  //             classes = {{paper:classes.drawerPaper}}
  //           >
  //             <div className={classes.drawerHeader}>
  //               <PopMenu />
  //               <IconButton onClick={handleDrawerClose} color = "inherit">
  //                 {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
  //               </IconButton>
  //
  //             </div>
  //             <Options />
  //           </Drawer>
  //           <main
  //             className={clsx(classes.content, {
  //               [classes.contentShift]: open,
  //             })}
  //           >
  //             <div className={classes.drawerHeader} />
  //
  //           </main>
  //           </ThemeProvider>
  //         </div>
  //     );
  //   }else{
  //     return (
  //         <div className={classes.root}>
  //         <CssBaseline />
  //         <ThemeProvider theme = {mytheme}>
  //         <AppBar
  //           position="fixed"
  //           className={clsx(classes.appBar, {
  //             [classes.appBarShift]: open,
  //           })}
  //           color = {choice}
  //         >
  //           <Toolbar >
  //             <IconButton
  //               color="inherit"
  //               aria-label="open drawer"
  //               onClick={handleDrawerOpen}
  //               edge="start"
  //               className={clsx(classes.menuButton, open && classes.hide)}
  //             >
  //               <MenuIcon />
  //             </IconButton>
  //             <div class="border d-table w-100">
  //           <h2 class="d-table-cell tar2">Welcome to ScribeAR</h2>
  //           <div class="d-table-cell tar">
  //             <Button variant="contained" variant="text" color="secondary" onClick={new AzureRecognition().downloadTxtFile} startIcon={<SaveAltIcon/>}>Download transcript</Button>
  //           </div>
  //         </div>
  //           </Toolbar>
  //         </AppBar>
  //
  //         <Drawer
  //           className={classes.drawer}
  //           width = "50%"
  //           variant="persistent"
  //           anchor="left"
  //           open={open}
  //           classes = {{paper:classes.drawerPaper}}
  //         >
  //           <div className={classes.drawerHeader}>
  //             <PopMenu />
  //             <IconButton onClick={handleDrawerClose} color = "inherit">
  //               {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
  //             </IconButton>
  //
  //           </div>
  //           <div>...</div>
  //         </Drawer>
  //         <main
  //           className={clsx(classes.content, {
  //             [classes.contentShift]: open,
  //           })}
  //         >
  //           <div className={classes.drawerHeader} />
  //
  //         </main>
  //         </ThemeProvider>
  //         </div>
  //     )
  //   }
  // } else {
  if (setting == 1){
    return (
        <div className={classes.root}>
          <CssBaseline />
          <ThemeProvider theme = {mytheme}>
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
              <div class="border d-table w-100">
          <h2 class="d-table-cell tar2">Welcome to ScribeAR</h2>
          <div class="d-table-cell tar">
            <Button variant="contained" variant="text" color="secondary" onClick={new Recognition().downloadTxtFile} startIcon={<SaveAltIcon/>}>Download transcript</Button>
          </div>
        </div>
            </Toolbar>
          </AppBar>

          <Drawer
            className={classes.drawer}
            width = "50%"
            variant="persistent"
            anchor="left"
            open={open}
            classes = {{paper:classes.drawerPaper}}
          >
            <div className={classes.drawerHeader}>
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
  }else{
    return (
        <div className={classes.root}>
        <CssBaseline />
        <ThemeProvider theme = {mytheme}>
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
            <div class="border d-table w-100">
          <h2 class="d-table-cell tar2">Welcome to ScribeAR</h2>
          <div class="d-table-cell tar">
            <Button variant="contained" variant="text" color="secondary" onClick={new Recognition().downloadTxtFile} startIcon={<SaveAltIcon/>}>Download transcript</Button>
          </div>
        </div>
          </Toolbar>
        </AppBar>

        <Drawer
          className={classes.drawer}
          width = "50%"
          variant="persistent"
          anchor="left"
          open={open}
          classes = {{paper:classes.drawerPaper}}
        >
          <div className={classes.drawerHeader}>
            <PopMenu />
            <IconButton onClick={handleDrawerClose} color = "inherit">
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>

          </div>
          <div>...</div>
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
//}
}
