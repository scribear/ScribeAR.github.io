import React from 'react'
import UserInput from './Key'
import Dropdown from './Region'
import AzureRecord from './AzureRecord'
import EnterButton from './EnterButton'
import { Divider } from '@material-ui/core';
import {
     flip_switchMenus,
     flip_invertColors,
     flip_micVisual,
     increment_textSize,
     decrement_textSize,
     increment_lineWidth,
     decrement_lineWidth,
     increment_numLines,
     decrement_numLines
} from '../../../redux/actions'

import store from '../../../store/';
import LanguageOptions from './Language'
import TargetLanguage from './TargetLanguage'



export default function AzureOptions() {
    // These are functions that take an object and return an element of the object.
    // They are passed to useSelector, which feeds the global state object into them.
    return (
         <div className="AzureOptions" id="azure-options-space">
             <div className = "azuremenutext">
                    <b>AZURE</b>
                </div>
              <div className = "azuremenutext2">
                    <b>OPTIONS</b>
               </div>
                  <div className = "divider">
                    <Divider variant="middle" />
               </div>



               <div className="item-wrapper">
                    <UserInput store ={store}/>
               </div>

               <br></br> <br></br><br></br><br></br>
               <div>
                 <div className = "regionText">
                     Region:
                 </div>
                 <Dropdown/>
               </div>
              <div className="item-wrapper">
                   <EnterButton />
              </div>
              <div>
                <div className = "languageText">
                    Source Lang:
                </div>
                <LanguageOptions/>
              </div>
              <div>
                <div className = "transLanguageText">
                    Translational Lang:
                </div>
                <TargetLanguage/>
              </div>

         </div>
    );
}
