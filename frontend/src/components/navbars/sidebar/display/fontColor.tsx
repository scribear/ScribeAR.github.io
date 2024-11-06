import Theme from '../../../theme';
import { ThemeProvider } from '../../../../muiImports';
import FontColorWheelButton from './fontColorButton';


export default function FontColor() {

  const {myTheme} = Theme();

  return (
    <div>
      <ThemeProvider theme={myTheme}>
        <FontColorWheelButton />
      </ThemeProvider>
    </div>
  );
}