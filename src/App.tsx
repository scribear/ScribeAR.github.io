import Desktop from './mode/desktop/Desktop';
import { Provider, useDispatch, useSelector} from 'react-redux';
import { RootState, DisplayStatus } from './redux/types';

import './App.css';

function App() {
  const display = useSelector((state: RootState) => {
    return state.DisplayReducer as DisplayStatus;
 }); 
  return (
    <div className="App" style = {{ color:  display.primaryColor, background: display.primaryColor}}>
      <header className="App-header" style = {{ color:  display.primaryColor, background: display.primaryColor, minWidth: "360px", height:"100vh", minHeight: "900px"}}>
        <Desktop/>
      </header>
    </div>
  );
}

export default App;
