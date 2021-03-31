import React from 'react'
import Index from './Loudness/Loudness'
import './MiddleSpace.css'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Draggable from '../DnD/Draggable/Draggable'
import Droppable from '../DnD/Droppable/Droppable'

const Wrapper = styled.div`
    width:100%;
    padding:2px;
    display:flex;
    justify-content: center;
`;

export default function MiddleSpace(props) {
  var h = props.height
  const mic = useSelector((state) => state.mic)
  // const stereoMic = useSelector((state) => state.steromic)
  const color = useSelector((state) => state.invertColors)
  // const isstereo = useSelector((state) => state.stereo)

  if (mic === 3) {//mono
    if (props.color == 'black') {
      return (<div className="MiddleSpace" style={{ height: h }}>
        <Wrapper>
          <Droppable className="d1" id="dr2" style={{
            width: '25vw',
            height: '34vh',
            margin: '1px'
          }}>
            <div className="show1"></div>
          </Droppable>
          <Droppable className="d1" id="dr1" style={{
            width: '25vw',
            height: '34vh',
            margin: '1px'
          }}>
            <div className="show1">
              <Draggable id="item1" style={{ margin: '0.5px' }}>
                {/* change Index to Stereo for test purpose*/}
                <Index ismic={mic} iscolor={color} style={{
                  position: "relative",
                }} />
              </Draggable>
            </div>
          </Droppable>
          <Droppable className="d1" id="dr2" style={{
            width: '25vw',
            height: '34vh',
            margin: '1px'
          }}>
            <div className="show1"></div>
          </Droppable>
          <Droppable className="d1" id="dr2" style={{
            width: '25vw',
            height: '34vh',
            margin: '1px'
          }}>
            <div className="show1"></div>
          </Droppable>
        </Wrapper>
      </div>)
    } else {
      return (<div className="MiddleSpace" style={{ height: h }}>
        <Wrapper>
          <Droppable className="d2" id="dr1" style={{
            width: '25vw',
            height: '34vh',
            margin: '1px'
          }}>
            <div className="show1">

            </div>
          </Droppable>
          <Droppable className="d2" id="dr2" style={{
            width: '25vw',
            height: '34vh',
            margin: '1px'
          }}>
            <div className="show1">
              <Draggable id="item1" style={{ margin: '0.5px' }}>
                <Index ismic={mic} iscolor={color} style={{
                  position: "relative",
                }} />
              </Draggable>
            </div>
          </Droppable>
          <Droppable className="d2" id="dr2" style={{
            width: '25vw',
            height: '34vh',
            margin: '1px'
          }}>
            <div className="show1"></div>
          </Droppable>
          <Droppable className="d2" id="dr2" style={{
            width: '25vw',
            height: '34vh',
            margin: '1px'
          }}>
            <div className="show1"></div>
          </Droppable>
        </Wrapper>
      </div>)
    }
  } else {
    return (
      <div className="MiddleSpace" style={{ height: h }}>
        <Wrapper>
          <Index ismic={mic} iscolor={color} style={{
            position: "relative",
          }} />
        </Wrapper>
      </div>
    )
  }
  // } else {
  //   if (props.color == 'black') {
  //     return (<div className="MiddleSpace" style={{ height: h }}>
  //       <Wrapper>
  //         <Droppable className="d1" id="dr1" style={{
  //           width: '25vw',
  //           height: '34vh',
  //           margin: '1px'
  //         }}>
  //           <div className="show1">
  //             <Draggable id="item1" style={{ margin: '0.5px' }}>
  //               {/* change Index to Stereo for test purpose*/}
  //               < Stereo ismic={mic} iscolor={color} style={{
  //                 position: "relative",
  //               }} />

  //             </Draggable>
  //           </div>
  //         </Droppable>
  //         <Droppable className="d1" id="dr2" style={{
  //           width: '25vw',
  //           height: '34vh',
  //           margin: '1px'
  //         }}>
  //           <div className="show1"></div>
  //         </Droppable>
  //         <Droppable className="d1" id="dr2" style={{
  //           width: '25vw',
  //           height: '34vh',
  //           margin: '1px'
  //         }}>
  //           <div className="show1"></div>
  //         </Droppable>
  //         <Droppable className="d1" id="dr2" style={{
  //           width: '25vw',
  //           height: '34vh',
  //           margin: '1px'
  //         }}>
  //           <div className="show1"></div>
  //         </Droppable>

  //       </Wrapper>
  //     </div>)
  //   } else {
  //     return (<div className="MiddleSpace" style={{ height: h }}>
  //       <Wrapper>
  //         <Droppable className="d2" id="dr1" style={{
  //           width: '25vw',
  //           height: '34vh',
  //           margin: '1px'
  //         }}>
  //           <div className="show1">
  //             {/* change Index to Stereo for test purpose*/}
  //             <Draggable id="item1" style={{ margin: '0.5px' }}><Stereo ismic={mic} iscolor={color} style={{
  //               position: "relative",
  //             }} />
  //             </Draggable>
  //           </div>
  //         </Droppable>
  //         <Droppable className="d2" id="dr2" style={{
  //           width: '25vw',
  //           height: '34vh',
  //           margin: '1px'
  //         }}>
  //           <div className="show1"></div>
  //         </Droppable>
  //         <Droppable className="d2" id="dr2" style={{
  //           width: '25vw',
  //           height: '34vh',
  //           margin: '1px'
  //         }}>
  //           <div className="show1"></div>
  //         </Droppable>
  //         <Droppable className="d2" id="dr2" style={{
  //           width: '25vw',
  //           height: '34vh',
  //           margin: '1px'
  //         }}>
  //           <div className="show1"></div>
  //         </Droppable>

  //       </Wrapper>
  //     </div>)
  //   }

  // }

}
