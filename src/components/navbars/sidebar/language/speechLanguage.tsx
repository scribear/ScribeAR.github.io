import * as React from 'react';
import Theme from '../../../theme'
import { useDispatch, useSelector } from 'react-redux';
import { RootState, ControlStatus } from '../../../../react-redux&middleware/redux/typesImports';
import { styled, alpha, Button, ThemeProvider, MenuItem, Menu, Autocomplete } from '../../../../muiImports';
import { MenuProps } from '@mui/material/Menu';
/* todo:
  1   Make language bar a fixed height so that it can only display ~8 languages 
      and not take up the whole screen
  2   Change language lists to a 2d array that so we can display the countries name
      and save the shortened title in RootState
*/
const textLanguages = [
  ["Afrikaans (South Africa)",	"af-ZA"],
  ["Amharic (Ethiopia)",	"am-ET"],
  ["Arabic (Algeria)",	"ar-DZ"],
  ["Arabic (Bahrain), modern standard",	"ar-BH"],
  ["Arabic (Egypt)",	"ar-EG"],
  ["Arabic (Iraq)",	"ar-IQ"],
  ["Arabic (Israel)",	"ar-IL"],
  ["Arabic (Kuwait)",	"ar-KW"],
  ["Arabic (Lebanon)",	"ar-LB"],
  ["Arabic (Libya)",	"ar-LY"],
  ["Arabic (Morocco)",	"ar-MA"],
  ["Arabic (Oman)",	"ar-OM"],
  ["Arabic (Palestinian Authority)",	"ar-PS"],
  ["Arabic (Qatar)",	"ar-QA"],
  ["Arabic (Saudi Arabia)",	"ar-SA"],
  ["Arabic (Syria)",	"ar-SY"],
  ["Arabic (Tunisia)",	"ar-TN"],
  ["Arabic (United Arab Emirates)",	"ar-AE"],
  ["Arabic (Yemen)",	"ar-YE"],
  ["Bengali (India)",	"bn-IN"],
  ["Bulgarian (Bulgaria)",	"bg-BG"],
  ["Burmese (Myanmar)",	"my-MM"],
  ["Catalan (Spain)",	"ca-ES"],
  ["Chinese (Cantonese, Traditional)",	"zh-HK"],
  ["Chinese (Mandarin, Simplified)",	"zh-CN"],
  ["Chinese (Taiwanese Mandarin)",	"zh-TW"],
  ["Croatian (Croatia)",	"hr-HR"],
  ["Czech (Czech)",	"cs-CZ"],
  ["Danish (Denmark)",	"da-DK"],
  ["Dutch (Belgium)",	"nl-BE"],
  ["Dutch (Netherlands)",	"nl-NL"],
  ["English (Australia)",	"en-AU"],
  ["English (Canada)",	"en-CA"],
  ["English (Ghana)",	"en-GH"],
  ["English (Hong Kong)",	"en-HK"],
  ["English (India)",	"en-IN"],
  ["English (Ireland)",	"en-IE"],
  ["English (Kenya)",	"en-KE"],
  ["English (New Zealand)",	"en-NZ"],
  ["English (Nigeria)",	"en-NG"],
  ["English (Philippines)",	"en-PH"],
  ["English (Singapore)",	"en-SG"],
  ["English (South Africa)",	"en-ZA"],
  ["English (Tanzania)",	"en-TZ"],
  ["English (United Kingdom)",	"en-GB"],
  ["English (United States)",	"en-US"],
  ["Estonian (Estonia)",	"et-EE"],
  ["Filipino (Philippines)", "fil-PH"],
  ["Finnish (Finland)",	"fi-FI"],
  ["French (Belgium)",	"fr-BE"],
  ["French (Canada)",	"fr-CA"],
  ["French (France)",	"fr-FR"],
  ["French (Switzerland)",	"fr-CH"],
  ["German (Austria)",	"de-AT"],
  ["German (Germany)",	"de-DE"],
  ["German (Switzerland)",	"de-CH"],
  ["Greek (Greece)",	"el-GR"],
  ["Gujarati (Indian)",	"gu-IN"],
  ["Hebrew (Israel)",	"he-IL"],
  ["Hindi (India)",	"hi-IN"],
  ["Hungarian (Hungary)",	"hu-HU"],
  ["Icelandic (Iceland)",	"is-IS"],
  ["Indonesian (Indonesia)",	"id-ID"],
  ["Irish (Ireland)",	"ga-IE"],
  ["Italian (Italy)",	"it-IT"],
  ["Japanese (Japan)",	"ja-JP"],
  ["Javanese (Indonesia)",	"jv-ID"],
  ["Kannada (India)",	"kn-IN"],
  ["Khmer (Cambodia)",	"km-KH"],
  ["Korean (Korea)",	"ko-KR"],
  ["Lao (Laos)",	"lo-LA"],
  ["Latvian (Latvia)",	"lv-LV"],
  ["Lithuanian (Lithuania)",	"lt-LT"],
  ["Macedonian (North Macedonia)",	"mk-MK"],
  ["Malay (Malaysia)",	"ms-MY"],
  ["Maltese (Malta)",	"mt-MT"],
  ["Marathi (India)",	"mr-IN"],
  ["Norwegian (Bokmål, Norway)",	"nb-NO"],
  ["Persian (Iran)",	"fa-IR"],
  ["Polish (Poland)",	"pl-PL"],
  ["Portuguese (Brazil)",	"pt-BR"],
  ["Portuguese (Portugal)",	"pt-PT"],
  ["Romanian (Romania)",	"ro-RO"],
  ["Russian (Russia)",	"ru-RU"],
  ["Serbian (Serbia)",	"sr-RS"],
  ["Sinhala (Sri Lanka)",	"si-LK"],
  ["Slovak (Slovakia)",	"sk-SK"],
  ["Slovenian (Slovenia)",	"sl-SI"],
  ["Spanish (Argentina)",	"es-AR"],
  ["Spanish (Bolivia)",	"es-BO"],
  ["Spanish (Chile)",	"es-CL"],
  ["Spanish (Colombia)",	"es-CO"],
  ["Spanish (Costa Rica)",	"es-CR"],
  ["Spanish (Cuba)",	"es-CU"],
  ["Spanish (Dominican Republic)",	"es-DO"],
  ["Spanish (Ecuador)",	"es-EC"],
  ["Spanish (El Salvador)",	"es-SV"],
  ["Spanish (Equatorial Guinea)",	"es-GQ"],
  ["Spanish (Guatemala)",	"es-GT"],
  ["Spanish (Honduras)",	"es-HN"],
  ["Spanish (Mexico)",	"es-MX"],
  ["Spanish (Nicaragua)",	"es-NI"],
  ["Spanish (Panama)",	"es-PA"],
  ["Spanish (Paraguay)",	"es-PY"],
  ["Spanish (Peru)",	"es-PE"],
  ["Spanish (Puerto Rico)",	"es-PR"],
  ["Spanish (Spain)",	"es-ES"],
  ["Spanish (Uruguay)",	"es-UY"],
  ["Spanish (USA)",	"es-US"],
  ["Spanish (Venezuela)",	"es-VE"],
  ["Swahili (Kenya)",	"sw-KE"],
  ["Swahili (Tanzania)",	"sw-TZ"],
  ["Swedish (Sweden)",	"sv-SE"],
  ["Tamil (India)",	"ta-IN"],
  ["Telugu (India)",	"te-IN"],
  ["Thai (Thailand)",	"th-TH"],
  ["Turkish (Turkey)",	"tr-TR"],
  ["Ukrainian (Ukraine)",	"uk-UA"],
  ["Uzbek (Uzbekistan)",	"uz-UZ"],
  ["Vietnamese (Vietnam)",	"vi-VN"],
  ["Zulu (South Africa)",	"zu-ZA"],
]

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
    console.log(event.target.value)
    setState({ ...state, language: event.target.value })
    dispatch({ type: 'SET_SPEECH_LANGUAGE', payload: event.target.value })
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

          <h2 className="tryout" style={{ fontSize: '12px' }}>{state.language.toString()}</h2>
        </Button>
        <StyledMenu
          id="demo-customized-menu"
          style={{maxHeight:"30vh"}}
          MenuListProps={{
            'aria-labelledby': 'demo-customized-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {textLanguages.map((language : string[], index) =>
              <MenuItem value = {language} onClick={handleClickItem} disableRipple>
                  {}
              </MenuItem>
          )}    
        </StyledMenu>
      </ThemeProvider>

    </div>
  );
}
//Recognize English(American)    [Edit]
//[Change]


//"Additional options are available here when using Azure"