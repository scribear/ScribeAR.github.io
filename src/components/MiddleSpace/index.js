import React from 'react'
import Index from './Loudness/index'
import './index.css'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Draggable from '../DnD/Draggable'
import Droppable from '../DnD/Droppable'
import './index.css'

import Stereo from "./Stereo/index"


const Wrapper = styled.div`
    width:100%;
    padding:2px;
    display:flex;
    justify-content: center;
`;


const droppableStyle = {
    backgroundColor: '#555',
    width:'50vw',
    height: '32vh',
    margin: '0px'
};
 
export default function MiddleSpace(props) {
  var h = props.height
  const mic = useSelector((state) => state.mic)
  const stereoMic = useSelector((state) => state.steromic)
  const color = useSelector((state) => state.invertColors)
  const isstereo = useSelector((state) => state.stereo)

    if (isstereo == 0){//mono
        if (props.color == 'black'){
            return ( <div className="MiddleSpace">
            <Wrapper>
                  <Droppable className = "d1" id = "dr1" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                    <div className = "show1">
                      <Draggable id = "item1" style = {{margin:'0.5px'}}>
                          {/* change Index to Stereo for test purpose*/}
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
                      {/* change Index to Stereo for test purpose*/}
                      <Draggable id = "item1" style = {{margin:'0.5px'}}><Index ismic = {mic} iscolor = {color} style={{
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
    }else{
        if (props.color == 'black'){
      return ( <div className="MiddleSpace">
            <Wrapper>
                  <Droppable className = "d1" id = "dr1" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                    <div className = "show1">
                      <Draggable id = "item1" style = {{margin:'0.5px'}}>
                          {/* change Index to Stereo for test purpose*/}
                          < Stereo ismic = {stereoMic} iscolor = {color} style={{
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
                      {/* change Index to Stereo for test purpose*/}
                      <Draggable id = "item1" style = {{margin:'0.5px'}}><Stereo ismic = {stereoMic} iscolor = {color} style={{
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


}
