import React from 'react'
import Index from './Loudness/index'
import './index.css'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Draggable from '../DnD/Draggable'
import Droppable from '../DnD/Droppable'
import './index.css'


const Wrapper = styled.div`
    width:100%;
    padding:32px;
    display:flex;
    justify-content: center;
`;


const droppableStyle = {
    backgroundColor: '#555',
    width:'50vw',
    height: '32vh',
    margin: '1px'
};
 
export default function MiddleSpace(props) {
  var h = props.height
  const mic = useSelector((state) => state.mic)
  const color = useSelector((state) => state.invertColors)
 //  var wid = "calc(100vh - 2 * " + paddingString + ")"
 //  if(window.innerHeight > window.innerWidth) {
 //    wid = "calc(100vw - 2 * " + paddingString + ")"
 //  }

  if (props.color == 'black'){
      return ( <div className="MiddleSpace">    
            <Wrapper>
                  <Droppable className = "d1" id = "dr1" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                    <div className = "show1">
                      <Draggable id = "item1" style = {{margin:'8px'}}>
                        
                          <Index ismic = {mic} iscolor = {color} style={{
                          position:"relative",
                          }}/> 
                       
                      </Draggable>
                      </div>
                  </Droppable>
                  <Droppable className = "d1" id = "dr2" style = {{

                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                      <div className = "show1"></div>
                  </Droppable>
                  <Droppable className = "d1" id = "dr2" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                      <div className = "show1"></div>
                  </Droppable>
                  <Droppable className = "d1" id = "dr2" style = {{
                    width:'25vw',

                    height: '34vh',
                    margin: '1px'}}>
                      <div className = "show1"></div>
                  </Droppable>
              </Wrapper>
          </div> )
  }else{
    return ( <div className="MiddleSpace">    
            <Wrapper>
                  <Droppable className = "d2" id = "dr1" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                    <div className = "show1">      

                      <Draggable id = "item1" style = {{margin:'8px'}}><Index ismic = {mic} iscolor = {color} style={{
                        position:"relative",
                      }}/> 
                    </Draggable>
                    </div>
                  </Droppable>
                  <Droppable className = "d2" id = "dr2" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                      <div className = "show1"></div>
                  </Droppable>
                  <Droppable className = "d2" id = "dr2" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                      <div className = "show1"></div>
                  </Droppable>
                  <Droppable className = "d2" id = "dr2" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                      <div className = "show1"></div>

                  </Droppable>
              </Wrapper>
          </div> )
  }
}
