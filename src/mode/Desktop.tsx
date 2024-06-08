import React from 'react';

import AppNavBar from '../components/navbars/appNavBar';
import { RootState } from '../react-redux&middleware/redux/typesImports';
import { RecogComponent } from '../components/api/recogComponent';
import { useSelector} from 'react-redux';


/* todo:
      mui theme file which has every theme and is sent to every styled function
      this will help readability and make custom themes way easier to implement
*/
export default function Desktop(props) {
   
   const RootState = useSelector((state: RootState) => {
      return state;
   });
   
   console.log("rootstate: ", RootState)

   return (
     <div>
         <AppNavBar rootState = {RootState}/>
         <RecogComponent />
     </div>
   )
  }

