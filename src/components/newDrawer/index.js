import React, { useState } from 'react';
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
import ShareIcon from '@material-ui/icons/Share';
import {EmailShareButton} from 'react-share';
import {EmailIcon} from "react-share";
import Fade from '@material-ui/core/Fade';
import SaveIcon from '@material-ui/icons/SaveSharp';
import LogIn from "../LogIn/LogIn";
import MailIcon from '@material-ui/icons/Mail';
import PopMenu from '../PopMenu'
import store from '../../store'
import { Button, Tooltip } from "@material-ui/core"
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import Recognition from "../Captions/Recognition"
import AzureRecognition from "../AzureCaptions/AzureRecognition"
import AzureOption from '../AzureTopSpace/AzureOptions'
import MenuSwitch from '../PopMenu/MenuSwitch'
import MenuHider from '../PlaceHolder/MenuHider'
import './index.css'
import {prev_page, next_page} from '../../redux/actions'
import AudioOption from '../AudioOption';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';



const drawerWidth = '21vw';


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
  const onWebspeech = (state) => state.onWebspeech;
  const dispatch = useDispatch();
  const setting = useSelector(submenu);
  const shouldShow = useSelector(menuhide);
  const wantsWebspeech = useSelector(onWebspeech);
  var hiddenText = ''
  var pick = "detail_wrap"
  if (shouldShow == 0){
    pick += '.active'
    hiddenText = 'visible'
  }else{
    pick = 'detail_wrap'
    hiddenText = 'auto-hide'
  }

  var hiddenTextDownload = 'Download Text'


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

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};

const handleClose = () => {
  setAnchorEl(null);
};
  if (wantsWebspeech) {
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
                <div class="border d-table w-100">
      <h2 class="d-table-cell tar2">ScribeAR</h2>
          {/* <Welcome
          isAuthenticated={isAuthenticated}
          user = {user}
          /> */}
      <div class="d-table-cell tar">
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
            {/* <Tooltip TransitionComponent={Fade} title="Upload the transcript to OneDrive" arrow> */}
            {/* <MenuItem onClick={handleClose}>
              <Upload/>
            </MenuItem> */}
            {/* <MenuItem onClick={handleClose}>
              <Folders/>
            </MenuItem> */}
            {/* </Tooltip> */}
          </Menu>

          </div>
          <div className='lock-wrap'>
            <MenuHider />

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
          <MenuSwitch title = 'Main Menu' left = {prev_page} right={next_page} submenu = 'true'/>
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
            <div class="border d-table w-100">
  <h2 class="d-table-cell tar2">Welcome to ScribeAR</h2>
      {/* <Welcome
      isAuthenticated={isAuthenticated}
      user = {user}
      /> */}
  <div class="d-table-cell tar">
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
        {/* <Tooltip TransitionComponent={Fade} title="Upload the transcript to OneDrive" arrow> */}
        {/* <MenuItem onClick={handleClose}>
          <Upload/>
        </MenuItem> */}
        {/* <MenuItem onClick={handleClose}>
          <Folders/>
        </MenuItem> */}
        {/* </Tooltip> */}
      </Menu>

      </div>
      <div className='lock-wrap'>
        <MenuHider />

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
        <MenuSwitch title = 'Source' left = {prev_page} right={next_page} submenu = 'true'/>
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
  } else{
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
            <div class="border d-table w-100">
  <h2 class="d-table-cell tar2">Welcome to ScribeAR</h2>
      {/* <Welcome
      isAuthenticated={isAuthenticated}
      user = {user}
      /> */}
  <div class="d-table-cell tar">
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
        {/* <Tooltip TransitionComponent={Fade} title="Upload the transcript to OneDrive" arrow> */}
        {/* <MenuItem onClick={handleClose}>
          <Upload/>
        </MenuItem> */}
        {/* <MenuItem onClick={handleClose}>
          <Folders/>
        </MenuItem> */}
        {/* </Tooltip> */}
      </Menu>
      </div>
      <div className='lock-wrap'>
        <MenuHider />

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
        <MenuSwitch title = 'Audio Visuals' left = {prev_page} right={next_page} submenu = 'true'/>
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
} else {
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
                <div class="border d-table w-100">
      <h2 class="d-table-cell tar2">ScribeAR</h2>
          {/* <Welcome
          isAuthenticated={isAuthenticated}
          user = {user}
          /> */}
      <div class="d-table-cell tar">
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
              <Button variant="contained" variant="text" onClick={new AzureRecognition().downloadTxtFile} startIcon={<SaveIcon fontSize='large'/>}>Download</Button>
            </MenuItem>
            </Tooltip>
            {/* <Tooltip TransitionComponent={Fade} title="Upload the transcript to OneDrive" arrow> */}
            {/* <MenuItem onClick={handleClose}>
              <Upload/>
            </MenuItem> */}
            {/* <MenuItem onClick={handleClose}>
              <Folders/>
            </MenuItem> */}
            {/* </Tooltip> */}
          </Menu>

          </div>
          <div className='lock-wrap'>
            <MenuHider />

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
          <MenuSwitch title = 'MainMenu' left = {prev_page} right={next_page} submenu = 'true'/>
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
            <div class="border d-table w-100">
  <h2 class="d-table-cell tar2">ScribeAR</h2>
      {/* <Welcome
      isAuthenticated={isAuthenticated}
      user = {user}
      /> */}
  <div class="d-table-cell tar">
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
          <Button variant="contained" variant="text" onClick={new AzureRecognition().downloadTxtFile} startIcon={<SaveIcon fontSize='large'/>}>Download</Button>
        </MenuItem>
        </Tooltip>
        {/* <Tooltip TransitionComponent={Fade} title="Upload the transcript to OneDrive" arrow> */}
        {/* <MenuItem onClick={handleClose}>
          <Upload/>
        </MenuItem> */}
        {/* <MenuItem onClick={handleClose}>
          <Folders/>
        </MenuItem> */}
        {/* </Tooltip> */}
      </Menu>

      </div>
      <div className='lock-wrap'>
        <MenuHider />

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
        <MenuSwitch title = 'Source' left = {prev_page} right={next_page} submenu = 'true'/>
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
  } else{
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
            <div class="border d-table w-100">
  <h2 class="d-table-cell tar2">Welcome to ScribeAR</h2>
      {/* <Welcome
      isAuthenticated={isAuthenticated}
      user = {user}
      /> */}
  <div class="d-table-cell tar">
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
          <Button variant="contained" variant="text" onClick={new AzureRecognition().downloadTxtFile} startIcon={<SaveIcon fontSize='large'/>}>Download</Button>
        </MenuItem>
        </Tooltip>
        {/* <Tooltip TransitionComponent={Fade} title="Upload the transcript to OneDrive" arrow> */}
        {/* <MenuItem onClick={handleClose}>
          <Upload/>
        </MenuItem> */}
        {/* <MenuItem onClick={handleClose}>
          <Folders/>
        </MenuItem> */}
        {/* </Tooltip> */}
      </Menu>

      </div>
      <div className='lock-wrap'>
        <MenuHider />

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
        <MenuSwitch title = 'Audio Visuals' left = {prev_page} right={next_page} submenu = 'true'/>
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
}
