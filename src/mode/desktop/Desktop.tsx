import './Desktop.css';
import AppBar from '../../components/topbar/topbar'
import { RootState } from '../../redux/types';
import { WebRecognitionExample } from '../../components/api/recogComponent';
import { Provider, useDispatch, useSelector} from 'react-redux';
import { store } from '../../store';

/* todo:
      mui theme file which has every theme and is sent to every styled function
      this will help readability and make custom themes way easier to implement
*/
export default function Desktop(props) {
   
   const RootState = useSelector((state: RootState) => {
      return state;
   });   


   console.log(RootState)
   const dispatch = useDispatch()
   return (
     <div>
        <AppBar rootState = {RootState}/>
        <WebRecognitionExample/>
     </div>
   )
  }

