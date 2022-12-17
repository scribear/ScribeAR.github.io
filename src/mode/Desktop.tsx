import React from 'react';

import AppNavBar from '../components/navbars/appNavBar';
import { RootState } from '../react-redux&middleware/redux/typesImports';
import { WebRecognitionExample } from '../components/api/recogComponent';
import { Provider, useDispatch, useSelector} from 'react-redux';
import { store } from '../store';
import { useCallback, useEffect } from 'react';

import { STTRenderer } from '../components/sttRenderer';
import { WebRecognitionExampleeeeee } from '../components/api/recogComponent copy';


/* todo:
      mui theme file which has every theme and is sent to every styled function
      this will help readability and make custom themes way easier to implement
*/
export default function Desktop(props) {
   
   const RootState = useSelector((state: RootState) => {
      return state;
   });
   

   console.log(RootState)

   return (
     <div>
        <AppNavBar rootState = {RootState}/>
        {/* <WebRecognitionExample/> */}
        {/* <WebRecognitionExampleeeeee/> */}
         <STTRenderer/>
     </div>
   )
  }

