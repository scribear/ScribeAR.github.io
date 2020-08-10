import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Recognition from "../Captions/Recognition"
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Tooltip } from 'reactstrap';
import microsoftOnedrive from '@iconify/icons-mdi/microsoft-onedrive';
import Menu from '@material-ui/core/Menu';
import Fade from '@material-ui/core/Fade';
import MenuItem from '@material-ui/core/MenuItem';
import { Icon } from '@fluentui/react/lib/Icon';
import { initializeIcons } from '@uifabric/icons';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { mergeStyles, registerIcons } from 'office-ui-fabric-react/lib/Styling';
import { ImageIcon } from 'office-ui-fabric-react/lib/Icon';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { css } from 'office-ui-fabric-react/lib/Utilities';
import { TestImages } from '@uifabric/example-data';







function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));


const iconClass = mergeStyles({
  height: 25,
  width: 25,
  margin: '0 0px',
});

registerIcons({
  icons: {
    'onedrive-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,2048,2048">
        <g fill="#1B559B">
          <path d="M 1860 1196 q 53 10 94 37 q 18 12 35 29 q 16 16 30 40 q 13 23 21 53 q 8 30 8 68 q 0 37 -10 75 q -11 38 -34 69 q -23 31 -58 51 q -36 20 -86 20 h -1079 q -78 0 -131 -24 q -54 -25 -87 -65 q -34 -40 -49 -91 q -15 -52 -15 -107 q 0 -46 12 -81 q 11 -35 31 -61 q 19 -27 43 -45 q 24 -19 50 -31 q 60 -29 136 -35 q 0 -1 4 -26 q 3 -25 16 -61 q 12 -37 36 -80 q 24 -43 64 -79 q 39 -37 98 -61 q 59 -25 141 -25 q 57 0 103 15 q 45 15 81 38 q 35 23 62 52 q 26 28 44 55 q 18 -10 42 -18 q 20 -7 48 -12 q 27 -6 60 -6 q 40 0 91 15 q 50 14 94 48 q 44 33 75 88 q 30 55 30 136 m -1463 174 q 0 53 10 99 q 10 46 29 86 h -170 q -52 0 -100 -23 q -48 -23 -85 -61 q -37 -38 -59 -87 q -22 -50 -22 -104 q 0 -49 11 -87 q 10 -38 27 -66 q 17 -29 39 -49 q 21 -21 44 -35 q 53 -33 121 -41 q -1 -9 -1 -18 q -1 -9 -1 -17 q 0 -72 27 -134 q 27 -63 73 -110 q 45 -47 106 -74 q 60 -27 127 -27 q 36 0 66 7 q 29 6 51 14 q 25 10 45 21 q 27 -48 65 -89 q 37 -41 84 -71 q 46 -30 101 -47 q 55 -17 115 -17 q 39 0 80 8 q 41 7 83 24 q 72 28 121 71 q 49 42 81 90 q 32 47 49 94 q 16 46 22 82 q -23 2 -43 5 q -21 3 -40 8 q -66 -69 -148 -104 q -82 -36 -177 -36 q -76 0 -136 17 q -60 17 -106 45 q -47 28 -81 64 q -34 36 -58 75 q -24 38 -39 76 q -15 37 -23 67 q -51 12 -102 38 q -52 26 -93 68 q -42 42 -67 101 q -26 59 -26 137" />
        </g>
      </svg>
    ),
    'onenote-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <g fill="#80397b">
          <path d="M31.929 13.579v4.791c0 0.185-0.067 0.344-0.199 0.479-0.133 0.131-0.293 0.2-0.476 0.2h-1.039v-6.149h1.039c0.184 0 0.344 0.067 0.476 0.199 0.132 0.136 0.199 0.292 0.199 0.481zM31.253 19.757c0.184 0 0.344 0.067 0.476 0.199s0.199 0.293 0.199 0.476v4.809c0 0.187-0.067 0.344-0.199 0.48-0.133 0.129-0.293 0.195-0.476 0.195h-1.039v-6.161zM31.253 6.037c0.184 0 0.356 0.068 0.512 0.2 0.156 0.136 0.235 0.295 0.235 0.48v4.792c0 0.196-0.081 0.361-0.235 0.487-0.156 0.12-0.328 0.18-0.512 0.18h-1.719v14.779c0 0.18-0.071 0.32-0.209 0.441-0.14 0.1-0.299 0.16-0.485 0.16h-8.939v-3.020h6.943v-1.441h-6.943v-1.697h6.943v-1.361h-6.943v-1.74h6.943v-1.34h-6.943v-1.699h6.943v-1.341h-6.943v-1.74h6.943v-1.36h-6.943v-1.7h6.943v-1.42h-6.943v-3.377h9.183c0.021 0 0.1 0.059 0.225 0.18 0.127 0.125 0.203 0.279 0.227 0.459v1.081zM18.195 0.885v30.229l-18.195-3.141v-23.865l18.196-3.221zM13.004 9.845l-2.135 0.14v3.972c-0.024 2.327-0.024 3.671 0 4.028l-4.253-7.759-2.172 0.085v11.008l1.699 0.139v-8.123l4.587 8.353 2.273 0.139z" />
        </g>
      </svg>
    ),
  },
});




export default function CustomizedSnackbars() {
  initializeIcons();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickAnchor = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
      <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" variant="contained" variant="text" onClick={handleClickAnchor} startIcon={<CloudUploadIcon/>}>Upload</Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseAnchor}
      >
        <MenuItem onClick={handleCloseAnchor}>
          <div onClick={handleClick}>
            <Button variant="contained" variant="text" onClick={new Recognition().uploadFile} startIcon={<FontIcon iconName="onedrive-svg" className={iconClass}/>}>OneDrive</Button>
            <div class = "upload">
            <Snackbar open={open} autoHideDuration={8000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="success">
                Upload Successful!
              </Alert>
            </Snackbar>
            </div>
          </div>
        </MenuItem>
        <MenuItem onClick={handleCloseAnchor}>
          <div onClick={handleClick}>
            <Button variant="contained" variant="text" onClick={new Recognition().uploadFile} startIcon={<FontIcon iconName="onenote-svg" className={iconClass}/>}>OneNote</Button>
          </div>
        </MenuItem>
      </Menu>
      </div>
    );
}
