# Introduction

**marcinmatys/whisper_streaming** is a sample web app implementation of real time voice transcription.  
This project is a fork of the [whisper_streaming](https://github.com/ufal/whisper_streaming)  
This project is based on [whisper_streaming](https://github.com/ufal/whisper_streaming) and [faster-whisper](https://github.com/SYSTRAN/faster-whisper)

# Motivation

- **Web Browser-Based Client with WebSocket Communication**: Develop a client that operates directly from a web browser, utilizing WebSocket for real-time communication.
- **Addressing Issues Related to Silence Processing**: Aim to solve critical problems such as buffer overflow, insufficient segments for chunking, slowdowns, and freezing of the transcription process.  
  Using --vad param or vad-streaming branch unfortunately does not work for me.

# Features
- **Web interface**: A simple web browser interface that allows users to start and stop audio recordings and observe real-time transcription results.  
  Voice is streamed to the server via WebSocket. Confirmed transcription fragments are sent back through the WebSocket and displayed in the browser.  
- **VAD and silence removal**: Uses NumPy to determine the signal's power, detecting and removing periods of silence in the audio before processing by OnlineASRProcessor.   
  This ensures that only meaningful audio segments are sent for transcription, improving efficiency and significantly reduces the problems described above.  
- **Read uncommited transcription and clear buffer when silence detected**:  
  When silence is detected, OnlineASRProcessor finish() and init() methods are called to read uncommited transcription and clear buffer.  
  We loose context and have uncommited transcription then, but it does not have a significant impact on quality.  

# Test Environment

- **Hardware**: Dell Precision 3581 laptop with NVIDIA RTX A500 GPU (4 GB VRAM)
- **Operating** System: Windows 11
- **Software**: Python 3.12.4, CUDA 12.5, CUDNN 8 .9


# instalation
 
For detailed installation instructions, please refer to the original whisper_streaming and faster-whisper projects on GitHub.  

### CUDA 12 and cuDNN 8 for CUDA 12

First, update the drivers for your GPU card.  

**CUDA 12**  
[CUDA Installation Guide for Microsoft Windows](https://docs.nvidia.com/cuda/cuda-installation-guide-microsoft-windows/index.html)  
Note: There was an issue installing the Nsight Visual Studio Edition component, but it is not necessary.  
Use custom installation and uncheck Nsight VSE, Visual Studio Integration, Nsight Systems, and Nsight Compute.  

**cuDNN 8**  
Note! it is important to install version 8 and not the default version 9.   
[cuDNN Installation Guide](https://docs.nvidia.com/deeplearning/cudnn/latest/installation/windows.html)    
[Download Older Versions of cuDNN](https://developer.nvidia.com/rdp/cudnn-archive)

**Environment variables**  
Add the following paths to your system's environment variables  
```
C:\Program Files\NVIDIA\CUDNN\v8.9\bin  
C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.5\bin  
C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.5\libnvvp 
```

### Python packages

**Install dependencies from requirements file**  

`pip install -r requirements.txt  `


**Install dependencies manually**  

```
pip install librosa soundfile  
pip install faster-whisper  
pip install flask
pip install flask-cors  
pip install websockets  
pip install cryptography (for https)
```

# Usage

**run server for transcription**  
`python whisper_server.py --backend faster-whisper --language pl --min-chunk-size 1 --silence-size 2 --model medium`  
--silence-size (Silence segment size in seconds, default value 2)  
--silence-threshold (default value 0.01)  

For information about other parameters, refer to the whisper_streaming project on GitHub.  

**run web app with sample UI**  
`python web_app.py`

**open UI**  
In your web browser, navigate to the URL specified in the server log, for example: https://192.168.0.149:5000   
Use "Start Recording" button to start audio recording and remember to click "Stop Recording" when you finish

# Issues
<span style="color:red;">**The most critical issue is the lack of support for multiple simultaneous users**</span>   
The original whisper-streaming does not support batching inference, making it unsuitable for systems with many users.  
Word timestamps are critical for whisper-streaming, which probably further complicates the implementation of batching  
https://github.com/ufal/whisper_streaming/issues/55  
https://github.com/ufal/whisper_streaming/issues/42

# Feedback
I appreciate any feedback that can help me improve the project.  
If you have suggestions or notice areas where the code can be enhanced, or identify any conceptual errors,  please let me know:  
- **Open an Issue**: You can open an issue on GitHub to report bugs, suggest improvements, or provide general feedback.  
  Provide as much detail as possible to help me understand and address your feedback.
- **Send an Email**: If you prefer, you can also send your feedback directly via email. Please include a clear subject line and detailed description of your suggestions or issues.

**I am particularly interested in any information regarding support for multiple simultaneous users. If you know of any ways to address this topic, please let me know.**

# Roadmap
- Support for Multiple Simultaneous Users: Research potential batching implementations and other solutions to handle multiple users effectively.  
- VAD management: Verify the current concept and introduce necessary changes to improve the accuracy and efficiency of the entire transcription process.  
- Performance Testing: Conduct tests on high-performance GPUs, such as the NVIDIA RTX A6000, to evaluate performance.  
- WebSockets with FastAPI: Investigate and implement use of WebSockets with FastAPI to improve performance.  
- Docker Image: Create a Docker image for whisper_server.py to facilitate easier deployment.  

# Contact

Marcin Matysek, marcin.matysek@gmail.com
