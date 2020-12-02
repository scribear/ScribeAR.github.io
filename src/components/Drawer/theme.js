import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';


const mytheme = createMuiTheme({
  palette: {
    primary: {
      main: blue[900]
    },
    secondary: {
      main: orange[800]
    },
  },
  status: {
    danger: 'orange',
  },
});

export default mytheme;
