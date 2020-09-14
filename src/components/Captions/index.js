import React, {useState} from 'react'
import { useSelector , useDispatch} from 'react-redux'
import styles from './index.module.css'
import Recognition from './Recognition'
import { Button } from "@material-ui/core"
import mytheme from '../newDrawer/theme'
import {ThemeProvider} from "@material-ui/core/styles";


export default function Captions(props) {

     const lineWidth = useSelector((state) => state.lineWidth)
     const numLines = useSelector((state) => state.numLines)
     const recording = useSelector((state) => state.recording)
     const [maxHeight, setMaxHeight] = useState(64)
     const [visible, setVisible] = useState(false)
     const correctAzureKey = useSelector((state) => state.correctAzureKey)
     const stream_text = useSelector((state)=>state.streamtext)

     var isCorrectKey = correctAzureKey ? true : false

     // Sloppy styling. Please change.

     var paddingString = (11 - lineWidth) * 3 + 'vw'
     var h = numLines + 'vh'
     var resH = (43 - numLines) + 'vh'
     var sz = props.textSize
     const DisTop = () => {
       if (document.getElementById("captionsSpace").scrollTop >= maxHeight) {
          setMaxHeight(document.getElementById("captionsSpace").scrollTop);
       }
       if (maxHeight - document.getElementById("captionsSpace").scrollTop > 10) {
         setVisible(true);
       } else {
         setVisible(false);
       }
       // console.log(maxHeight);
       // console.log(document.getElementById("captionsSpace").scrollTop);
       // console.log(visible);
     };
     if (props.azureCaptionSuccess == false) {
      return (
        <div>
           <Recognition isRecording={false} />
        </div>
       )
    } else {
          if (visible) {
            return (
              <ThemeProvider theme = {mytheme}>
              <div>
                <Button className={styles.scroll} variant="contained" onClick= {new Recognition().scrollBottom} color="secondary">Scroll to Bottom
              </Button>
                <div onScroll={DisTop} className="captionsSpace" id="captionsSpace"
                style={{
                  fontSize: sz,
                  height: h,
                  width: "100vw",
                  overflow: "auto",
                  paddingLeft: paddingString,
                  paddingRight: paddingString }}>
                      <Recognition isRecording={recording} />
                    </div>
              </div>
              </ThemeProvider>
            )
          } else {
            return (
              <ThemeProvider theme = {mytheme}>
              <div>
                <Button className={styles.scrollhidden} variant="outlined" onClick= {new Recognition().scrollBottom} color="secondary">Scroll to Bottom
              </Button>
                <div onScroll={DisTop} className="captionsSpace" id="captionsSpace"
                style={{
                  fontSize: sz,
                  height: h,
                  width: "100vw",
                  overflow: "auto",
                  paddingLeft: paddingString,
                  paddingRight: paddingString }}>
                      <Recognition isRecording={recording} />
                    </div>
              </div>
              </ThemeProvider>
            )
          }

    }
}
