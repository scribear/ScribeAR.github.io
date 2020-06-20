import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './index.css'
import store from '../../../../store/';
import { flip_entered_key, flip_azure_warning} from '../../../../redux/actions'
import { Button } from "@material-ui/core"


// This code only works if the initial state is Off. It's surprisingly way harder
// to get this to work if you want the inital state of the checkbox to be checked.

export default function EnterButton(props) {
    const dispatch = useDispatch()

    if (store.azureRegionOptionsReducer == undefined) {
      alert("Entering an Azure Key will delete the previous script.")
      store.azureRegionOptionsReducer = 'empty'
    }
    // flip recording when space bar is pressed

     //const setting = useSelector(props.setting)
     // useDispatch returns the state modifying function, invoked below.
     // if (store.azureKeyReducer != 'empty')
     if (store.isSuccessReducer == 'success') {
       return (
         <div>
              <div className="setting-wrapper">

                   <div className = "setting-button2">
                       <Button className="enter">
                           <div id = "entertext">
                               Enter
                           </div>
                       </Button>
                   </div>
              </div>
         </div>
       )
     } else {
     return (
          <div>
               <div className="setting-wrapper">
                    <div className = "setting-button2">
                        <Button className="enter"
                        onClick={() => dispatch(flip_entered_key())} >
                            <div id = "entertext">
                                Enter
                            </div>
                        </Button>
                    </div>
               </div>
          </div>
     )
   }
}
