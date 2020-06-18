import React from 'react'
import './index.css'
export default function CheckButton(props) {
     return (
          <div>
               {props.item}
               <div className="setting-wrapper">
                    <button className="check">Enter</button>
               </div>
          </div>
     );
}
