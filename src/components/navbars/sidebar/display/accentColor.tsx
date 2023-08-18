import Theme from '../../../theme';
import { ThemeProvider } from '../../../../muiImports';
import AccentColorButton from './accentColorButton';


export default function AccentColor() {

  const {myTheme} = Theme();

  return (
    <div>
      <ThemeProvider theme={myTheme}>
        <AccentColorButton />
      </ThemeProvider>
    </div>
  );
}