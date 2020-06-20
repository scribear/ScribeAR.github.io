import React from 'react'
import './index.css'
import Options from './AzureOptions'
import SwipeableTemporaryDrawer from '../../components/AzureDrawer'


// JavaScript functions used: setTimeout, clearTimeout, bind, getElementById,
// addEventListener, removeEventListener
// React functions used: constructor, setState, componentDidMount, render
class AzureTopSpace extends React.Component {
     // // When options are shown:
     //      // Clicking in the optionsSpace triggers show() then resetTimeout().
     //      // Clicking in the hideSpace triggers hide().
     // // When options are not shown:
     //      // Clicking anywhere in the outer div triggers show().
     // // Event listeners enforce these rules in outer and optionsSpace elements.
     // // hideSpace uses a simple onClick, which only works when the element is shown.
     //
     // constructor(props) {
     //      super(props)
     //      this.state = {
     //           shown: true, // Whether the options area is shown. Used in JSX.
     //           // Set 15 second timeout and when it expires, run this.hide.
     //           // Immediately store the returned id for later use.
     //           timeoutId: setTimeout(this.hide.bind(this), 15000)
     //      }
     //      // Bind functions so we can use the keyword 'this' inside them.
     //      this.hide = this.hide.bind(this)
     //      this.show = this.show.bind(this)
     //      this.resetTimeout = this.resetTimeout.bind(this)
     // }
     //
     // hide() { // Hide the options area from view.
     //      this.setState({ shown: false })
     //      document.getElementById('outer').addEventListener('click', this.show)
     // }
     //
     // show() { // Show the options area. If already shown, just reset timeout.
     //      this.setState({ shown: true })
     //      document.getElementById('outer').removeEventListener('click', this.show)
     //      this.resetTimeout()
     // }
     //
     // resetTimeout() { // Reset the 15 second timer for hiding the options.
     //      clearTimeout(this.state.timeoutId) // Cancel the timeout set earlier.
     //      var toId = setTimeout(this.hide, 15000) // Set a new 15 second timeout.
     //      this.setState({timeoutId: toId}) // Store the id of the new timeout.
     // }
     // // The first time the component mounts, add an event listener to the options
     // // space, so whenever it's clicked, it shows.
     // componentDidMount() {
     //      document.getElementById('optionsSpace').addEventListener('click', this.show)
     // }

     render() {
          var h = '32vh'; // I don't remember why I set the height like this.
          // The Options component takes a function as a prop.
          return (
               <div className="AzureTopSpace" id="outer" style={{ height: h }}>
                     <div >
                    <div className="item-wrapper">
                        <SwipeableTemporaryDrawer color = "secondary"/>
                    </div>
                    </div>
               </div>
          )
     }
}

export default AzureTopSpace;
