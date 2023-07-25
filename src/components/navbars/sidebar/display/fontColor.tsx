import Theme from '../../../theme';
import { ThemeProvider } from '../../../../muiImports';
import ColorWheelButton from './colorButton';


export default function ShowFrequency() {

  const {myTheme} = Theme();

  return (
    <div>
      <ThemeProvider theme={myTheme}>
        <ColorWheelButton />
      </ThemeProvider>
    </div>
  );
}