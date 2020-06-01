import React from 'react'
import './index.css'
import '../MiddleSpace/index.css'
import PersistentDrawerLeft from '../newDrawer'

// JavaScript functions used: setTimeout, clearTimeout, bind, getElementById,
// addEventListener, removeEventListener
// React functions used: constructor, setState, componentDidMount, render
class TopSpace extends React.Component {
     render() {
          var h = '9vh'; // I don't remember why I set the height like this.
          // The Options component takes a function as a prop.
          return (
               <div className="TopSpace" id="outer" style={{ height: h }}>
                    <div >
                          <div className="item-wrapper">
                              <PersistentDrawerLeft color = {this.props.color}/>
                         </div>

                    </div>
               </div>
          )
     }
}

export default TopSpace;
