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
import TargetLanguge from './TargetLanguage'



export default function AzureOptions() {
    // These are functions that take an object and return an element of the object.
    // They are passed to useSelector, which feeds the global state object into them.
const items = [
  {
    id: 1,
    value: 'westus',
  },
  {
    id: 2,
    value: 'westus2',
  },
  {
    id: 3,
    value: 'ussouthcentral',
  },
  {
    id: 4,
    value: 'northcentralus',
  },
  {
    id: 5,
    value: 'useast',
  },
  {
    id: 6,
    value: 'useast2',
  },
  {
    id: 7,
    value: 'europewest',
  },
  {
    id: 8,
    value: 'europenorth',
  },
  {
    id: 9,
    value: 'brazilsouth',
  },
  {
    id: 10,
    value: 'australiaeast',
  },
  {
    id: 11,
    value: 'asiasoutheast',
  },
  {
    id: 12,
    value: 'asiaeast',
  },
];
    return (
         <div className="AzureOptions" id="azure-options-space">
             <div className = "azuremenutext">
                    <b>Microsoft Azure</b>
              </div>
                  <div className = "divider">
                    <Divider variant="middle" />
               </div>



               <div className="item-wrapper">
                  <UserInput store ={store}/>
               </div>
               <br></br>
               <br></br>
               <br></br>

              <div className="dd-wrapper">

                    <br></br>

                    <Dropdown title="" items={items}/>
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
                <TargetLanguge/>
              </div>

         </div>
    );
}
