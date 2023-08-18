import Theme from '../../../theme';
import { ThemeProvider } from '../../../../muiImports';
import BackgroundColorButton from './backgroundColorButton';


export default function BackgroundColor() {

  const {myTheme} = Theme();

  return (
    <div>
      <ThemeProvider theme={myTheme}>
        <BackgroundColorButton />
      </ThemeProvider>
    </div>
  );
}