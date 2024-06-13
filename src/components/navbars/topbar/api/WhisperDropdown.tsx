import React, { useState  } from 'react';
import { List, ListItem, Button } from '../../../../muiImports'


export default function WhisperDropdown(props) {

    // const [isTrue, setIsTrue] = useState<boolean>(false);
  // const [isClearCache, setIsClearCache] = useState<boolean>(false);
  const [isDownloadTiny, setIsDownloadTiny] = useState<boolean>(false);
  const [isDownloadBase, setIsDownloadBase] = useState<boolean>(false);
  // const [progress, setProgress] = useState(null);
  // const [showModal, setShowModal] = useState(false);


    const handleTinyDownload = () => {
        console.log("clicked download tiny")
        setIsDownloadTiny(prevIsDownloadTiny => !prevIsDownloadTiny);
        sessionStorage.setItem('isDownloadTiny', (!isDownloadTiny).toString());
      };

      const handleBaseDownload = () => {
        console.log("clicked download tiny")
        setIsDownloadBase(prevIsDownloadBase => !prevIsDownloadBase);
        sessionStorage.setItem('isDownloadBase', (!isDownloadBase).toString());

        const intervalId = setInterval(() => {
          let p = sessionStorage.getItem('whisper_progress');
          if (p === '100') {
              alert("Base model downloaded! trigger the mike by stopping and starting again");
              clearInterval(intervalId); // Stop checking once it's 100%
          }
      }, 2000); // Check every 2000 milliseconds, or 2 seconds
      };

      // --------------- Using a modal to show the progress

      // const handleBaseDownload = () => {
      //   console.log("clicked download base");
      //   setIsDownloadBase(prevIsDownloadBase => !prevIsDownloadBase);
      //   sessionStorage.setItem('isDownloadBase', (!isDownloadBase).toString());
    
      //   // Initially show the modal
      //   setShowModal(true);
    
      //   const intervalId = setInterval(() => {
      //     let p = sessionStorage.getItem('whisper_progress');
      //     setProgress(p); // Update the progress
      //     if (p === '100%') {
      //       clearInterval(intervalId); // Stop checking once it's 100%
      //     }
      //   }, 2000);
      // };
    
      // // Close the modal when progress reaches 100%
      // useEffect(() => {
      //   if (progress === '100%') {
      //     setShowModal(false);
      //   }
      // }, [progress]);

     

      // const handleClickClearCache = () => {
      //   console.log("clicked cache")
      //   setIsClearCache(prevIsClearCache => !prevIsClearCache);
      //   sessionStorage.setItem('isClearCache', (!isClearCache).toString());
      // };


    return (
      <>
        <div>
            <List component="div" disablePadding>
               <ListItem sx={{ pl: 4 }} style={{ width: '100%' }}>
                    <Button onClick={()=>{handleTinyDownload()}} variant="contained" color="inherit" style={{ width: '100%' }}>tiny (75 MB)</Button>
               </ListItem>
               <ListItem sx={{ pl: 4 }} style={{ width: '100%' }}>
                    <Button  onClick={()=>{handleBaseDownload()}} variant="contained" color="inherit" style={{ width: '100%' }}>base (145 MB)</Button>
               </ListItem>
               {/* TODO: add clear cache to delete the database with whisper.cpp models */}
               {/* <ListItem sx={{ pl: 4 }} style={{ width: '100%' }}>
                    <Button  onClick={()=>{handleClickClearCache()}} variant="contained" color="inherit" style={{ width: '100%' }}>Clear cache</Button>
               </ListItem> */}
            </List>
        </div>
        </>
    )
}