import { createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';


const mytheme = createMuiTheme({
  palette: {
    primary: {
        main: grey[800]
    },
    secondary: {
        main: grey[400]
    },
  },
  status: {
    danger: 'orange',
  },
});

export default mytheme;