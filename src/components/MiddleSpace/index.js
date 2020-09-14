import React from 'react'
import Index from './Loudness/index'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Draggable from '../DnD/Draggable'
import Droppable from '../DnD/Droppable'
import styles from './index.module.css'
import Stereo from "./Stereo/index"

//DND componet to 
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
  // const stereoMic = useSelector((state) => state.steromic)
  const color = useSelector((state) => state.invertColors)
  // const isstereo = useSelector((state) => state.stereo)

    if (mic < 4){//mono
        if (props.color == 'black'){
            return ( <div className={styles.MiddleSpace} style = {{height:h}}>
            <Wrapper>
                  <Droppable className={styles.d1} id = "dr1" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                    <div className = {styles.show1}>
                      <Draggable id = "item1" style = {{margin:'0.5px'}}>
                          {/* change Index to Stereo for test purpose*/}
                          <Index ismic = {mic} iscolor = {color} style={{
                          position:"relative",
                          }}/>

                      </Draggable>
                      </div>
                  </Droppable>
                  <Droppable className = {styles.d1} id = "dr2" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                      <div className = {styles.show1}></div>
                  </Droppable>
                  <Droppable className = {styles.d1} id = "dr2" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                      <div className = {styles.show1}></div>
                  </Droppable>
                  <Droppable className = {styles.d1} id = "dr2" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                      <div className = {styles.show1}></div>
                  </Droppable>

              </Wrapper>
          </div> )
  }else{
    return ( <div className="MiddleSpace" style = {{height:h}}>
            <Wrapper>
                  <Droppable className = {styles.d2} id = "dr1" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                    <div className = {styles.show1}>
                      {/* change Index to Stereo for test purpose*/}
                      <Draggable id = "item1" style = {{margin:'0.5px'}}><Index ismic = {mic} iscolor = {color} style={{
                        position:"relative",
                      }}/>
                    </Draggable>
                    </div>
                  </Droppable>
                  <Droppable className = {styles.d2} id = "dr2" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                      <div className = {styles.show1}></div>
                  </Droppable>
                  <Droppable className = {styles.d2} id = "dr2" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                      <div className = {styles.show1}></div>
                  </Droppable>
                  <Droppable className = {styles.d2} id = "dr2" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                      <div className = {styles.show1}></div>
                  </Droppable>

              </Wrapper>
          </div> )
  }
    }else{
        if (props.color == 'black'){
      return ( <div className="MiddleSpace" style = {{height:h}}>
            <Wrapper>
                  <Droppable className = {styles.d1} id = "dr1" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                    <div className = {styles.show1}>
                      <Draggable id = "item1" style = {{margin:'0.5px'}}>
                          {/* change Index to Stereo for test purpose*/}
                          < Stereo ismic = {mic} iscolor = {color} style={{
                          position:"relative",
                          }}/>

                      </Draggable>
                      </div>
                  </Droppable>
                  <Droppable className = {styles.d1} id = "dr2" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                      <div className = {styles.show1}></div>
                  </Droppable>
                  <Droppable className = {styles.d1} id = "dr2" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                      <div className = {styles.show1}></div>
                  </Droppable>
                  <Droppable className = {styles.d1} id = "dr2" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                      <div className = {styles.show1}></div>
                  </Droppable>

              </Wrapper>
          </div> )
  }else{
    return ( <div className="MiddleSpace" style = {{height:h}}>
            <Wrapper>
                  <Droppable className = {styles.d2} id = "dr1" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                    <div className = {styles.show1}>
                      {/* change Index to Stereo for test purpose*/}
                      <Draggable id = "item1" style = {{margin:'0.5px'}}><Stereo ismic = {mic} iscolor = {color} style={{
                        position:"relative",
                      }}/>
                    </Draggable>
                    </div>
                  </Droppable>
                  <Droppable className = {styles.d2} id = "dr2" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                      <div className = {styles.show1}></div>
                  </Droppable>
                  <Droppable className = {styles.d2} id = "dr2" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                      <div className = {styles.show1}></div>
                  </Droppable>
                  <Droppable className = {styles.d2} id = "dr2" style = {{
                    width:'25vw',
                    height: '34vh',
                    margin: '1px'}}>
                      <div className = {styles.show1}></div>
                  </Droppable>

              </Wrapper>
          </div> )
  }

    }


}
