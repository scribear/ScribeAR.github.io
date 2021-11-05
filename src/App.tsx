import Desktop from './mode/desktop/Desktop';
import { Provider, useDispatch, useSelector} from 'react-redux';
import { RootState, DisplayStatus } from './redux/types';

import './App.css';

function App() {
  const display = useSelector((state: RootState) => {
    return state.DisplayReducer as DisplayStatus;
 }); 
  return (
    <div className="App">
      <header className="App-header" style = {{ color: '#ffffff', background: display.primaryColor}}>
        <Desktop/>
      </header>
    </div>
  );
}

export default App;
