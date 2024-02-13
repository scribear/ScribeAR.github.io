import React, { useState } from 'react';
import { Button, Typography, Container, Box, Dialog, DialogTitle, DialogContent, 
  DialogActions, Grid, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, Input  } from '@mui/material';
import { List, ListItem, Divider, AddIcon, IconButton, ListItemText, FileUploadIcon } from '../../../../muiImports'; 
import { ConsoleLoggingListener } from 'microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common.browser/ConsoleLoggingListener';
import axios from 'axios';

export default function AudioUploader() {
  const [fileName, setFileName] = useState<string>('');
  const [fileObject, setFileObject] = useState<File | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [filename, setFilename] = useState('test1.txt');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setFileName(file.name);
      setFileObject(file);
    } else {
      setFileName('');
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpload = () => {
    console.log("chosen file info", fileObject);
    console.log("chosen download per minute", selectedOption);
    console.log("chosen download filename", )
    const link = 'https://api.github.com/repos/scribear/Phrases/contents/Biology111.txt'
    axios.get(link).then(response => {
      console.log(response); // Handle the response data
    })
    .catch(error => {
      console.error('Error fetching data:', error); // Handle any error
    });
    setOpen(false);
  };

  const handleSelectChange = (event: SelectChangeEvent<typeof selectedOption>) => {
    setSelectedOption(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(event.target.value);
  };

  return (
    <div>
      <List
          sx={{ width: '20vw', bgcolor: 'background.paper' }}
          component="div"
          aria-labelledby="nested-list-subheader"
        >
          <ListItem sx={{ pl: 4, mb: 1 }}>
            <ListItemText primary={"Upload Audio File (WAV, MP3)"} />
            <IconButton onClick={handleClickOpen}>
              <FileUploadIcon />
            </IconButton>
          </ListItem>
      </List>

      <Dialog open={open} onClose={handleClose} aria-labelledby="audio-upload-popup" maxWidth="sm" fullWidth={true}>
        <DialogTitle id="audio-upload-popup">Upload Audio File</DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <div>
                <Typography sx={{ mb: 2 }} variant="subtitle1">File Upload</Typography>
                <input
                  type="file"
                  hidden
                  id="audio-file-upload"
                  onChange={handleFileChange}
                />
                <label htmlFor="audio-file-upload">
                  <Button variant="contained" component="span">
                    <FileUploadIcon />
                    Choose File
                  </Button>
                </label>
                {fileName && (
                  <Typography sx={{ mt: 3 }} variant="body2"> {`Selected file: ${fileName}`} </Typography>
                )}
              </div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <div>
                <Typography sx={{ mb: 2 }} variant="subtitle1">Download Settings</Typography>
                <FormControl fullWidth >
                  <InputLabel id="download-frequency">auto download per minute</InputLabel>
                  <Select
                    labelId="download-frequency"
                    id="download-frequency-select"
                    value={selectedOption}
                    label="auto download per minute"
                    onChange={handleSelectChange}
                    sx={{ height: '40px' }}
                  >
                    <MenuItem value={1}>1 min</MenuItem>
                    <MenuItem value={2}>2 min</MenuItem>
                    <MenuItem value={3}>5 min</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mt: 2 }}>
                  {/* <InputLabel htmlFor="download-filename">Second Input</InputLabel> */}
                  <Input
                    id="download-filename"
                    value={filename}
                    onChange={handleInputChange}
                    aria-describedby="download-filename"
                  />
                </FormControl>
              </div>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};
