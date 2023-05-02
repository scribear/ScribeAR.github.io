import React, { useState, useEffect } from 'react';
import { List, ListItem, Button } from '../../../../muiImports'

export default function WhisperDropdown(props) {

    // const [isTrue, setIsTrue] = useState<boolean>(false);
  // const [isClearCache, setIsClearCache] = useState<boolean>(false);
  // const [isDownloadTiny, setIsDownloadTiny] = useState<boolean>(false);
  const [isDownloadBase, setIsDownloadBase] = useState<boolean>(false);


    // const handleTinyDownload = () => {
    //     console.log("clicked download tiny")
    //     setIsDownloadTiny(prevIsDownloadTiny => !prevIsDownloadTiny);
    //     sessionStorage.setItem('isDownloadTiny', (!isDownloadTiny).toString());
    //   };

      const handleBaseDownload = () => {
        console.log("clicked download tiny")
        setIsDownloadBase(prevIsDownloadBase => !prevIsDownloadBase);
        sessionStorage.setItem('isDownloadBase', (!isDownloadBase).toString());
      };

      // const handleClickClearCache = () => {
      //   console.log("clicked cache")
      //   setIsClearCache(prevIsClearCache => !prevIsClearCache);
      //   sessionStorage.setItem('isClearCache', (!isClearCache).toString());
      // };

    return (
        <div>
            <List component="div" disablePadding>
               {/* <ListItem sx={{ pl: 4 }} style={{ width: '100%' }}>
                    <Button onClick={()=>{handleTinyDownload()}} variant="contained" color="inherit" style={{ width: '100%' }}>tiny (75 MB)</Button>
               </ListItem> */}
               <ListItem sx={{ pl: 4 }} style={{ width: '100%' }}>
                    <Button  onClick={()=>{handleBaseDownload()}} variant="contained" color="inherit" style={{ width: '100%' }}>base (145 MB)</Button>
               </ListItem>
               {/* TODO: add clear cache to delete the database with whisper.cpp models */}
               {/* <ListItem sx={{ pl: 4 }} style={{ width: '100%' }}>
                    <Button  onClick={()=>{handleClickClearCache()}} variant="contained" color="inherit" style={{ width: '100%' }}>Clear cache</Button>
               </ListItem> */}
            </List>
        </div>
    )
}