import { createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';


const simpleTheme = createMuiTheme({
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

export default simpleTheme;