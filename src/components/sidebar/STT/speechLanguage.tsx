import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Theme from '../../theme'
import { RootState, ControlStatus } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
/* todo:
  1   Make language bar a fixed height so that it can only display ~8 languages 
      and not take up the whole screen
  2   Change language lists to a 2d array that so we can display the countries name
      and save the shortened title in RootState
*/
const languages = [
  "ar-EG",
  "ca-ES",
  "da-DK",
  "da-DK",
  "de-DE",
  "en-AU",
  "en-CA",
  "en-GB",
  "en-IN",
  "en-NZ",
  "en-US",
  "es-ES",
  "es-MX",
  "fi-FI",
  "fr-CA",
  "fr-FR",
  "hi-IN",
  "it-IT",
  "ja-JP",
  "ko-KR",
  "nb-NO",
  "nl-NL",
  "pl-PL",
  "pt-BR",
  "pt-PT",
  "ru-RU",
  "sv-SE",
  "zh-CN",
  "zh-HK",
  "zh-TW",]

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],

    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 10,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
        innerHeight: 40,
        outerHeight: 40,
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function CustomizedMenus() {
  const dispatch = useDispatch();
  const control = useSelector((state: RootState) => {
    return state.ControlReducer as ControlStatus;
  });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [state, setState] = React.useState({
    language: control.speechLanguage,
  });
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);

  };
  const handleClickItem = (event) => {
    setState({ ...state, language: event.target.id })
    dispatch({ type: 'SET_SPEECH_LANGUAGE', payload: event.target.id })
    setAnchorEl(null);
  }

  const { myTheme } = Theme()


  return (
    <div>
      <ThemeProvider theme={myTheme}>

        <Button
          id="demo-customized-button"
          aria-controls="demo-customized-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          variant="contained"
          disableElevation
          onClick={handleClick}
          sx={{ width: '2vw', height: 30, padding: 0 }}
        >

          <h2 className="tryout" style={{ fontSize: '12px' }}>{state.language}</h2>
        </Button>
        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            'aria-labelledby': 'demo-customized-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {languages.map((language: string, index) =>
            <MenuItem id={language} onClick={handleClickItem} disableRipple>
              {language}
            </MenuItem>
          )}
        </StyledMenu>
      </ThemeProvider>

    </div>
  );
}
