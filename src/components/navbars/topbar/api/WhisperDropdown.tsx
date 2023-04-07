import React, { useState, useEffect } from 'react';
import { List, ListItem, Button } from '../../../../muiImports'

export default function WhisperDropdown(props) {

    const [isTrue, setIsTrue] = useState<boolean>(false);
  const [isClearCache, setIsClearCache] = useState<boolean>(false);
  const [isDownloadTiny, setIsDownloadTiny] = useState<boolean>(false);
  const [sessionText, setSessionText] = useState(sessionStorage.getItem('myText') || '');


    const handleTinyDownload = () => {
        console.log("clicked download tiny")
        setIsDownloadTiny(prevIsDownloadTiny => !prevIsDownloadTiny);
        sessionStorage.setItem('isDownloadTiny', (!isDownloadTiny).toString());
      };

      const handleClickToggle = () => {
        console.log("clicked")
        setIsTrue(prevIsTrue => !prevIsTrue);
        sessionStorage.setItem('isTrue', (!isTrue).toString());
      };

      const handleClickClearCache = () => {
        console.log("clicked cache")
        setIsClearCache(prevIsClearCache => !prevIsClearCache);
        sessionStorage.setItem('isClearCache', (!isClearCache).toString());
      };

    return (
        <div>
            <List component="div" disablePadding>
               <ListItem sx={{ pl: 4 }} style={{ width: '100%' }}>
                    <Button onClick={()=>{handleTinyDownload()}} variant="contained" color="inherit" style={{ width: '100%' }}>tiny (75 MB)</Button>
               </ListItem>
               <ListItem sx={{ pl: 4 }} style={{ width: '100%' }}>
                    <Button  onClick={()=>{handleTinyDownload()}} variant="contained" color="inherit" style={{ width: '100%' }}>base (145 MB)</Button>
               </ListItem>
            </List>
        </div>
    )
}