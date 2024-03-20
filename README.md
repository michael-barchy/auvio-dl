# auvio-dl

Download videos from auvio

## Installation

* Click Code -> Download ZIP
* Unpack to your favorite location
* Goto to Google Chrome extensions management
* Click "Load unpacked extension" and point to the folder where you extracted the ZIP file
* Change extension id in auviodl.json, line 6 (if necessary)
* Start auvio-dl.command one to install Native Messaging Host

## Usage

* Visit Auvio (and login)
* Pick a video and click the play button (you will see a debugger notification, do NOT cancel)
* You will find a download button just before the subtitle icon
* There is no feedback of the download in the browser
* Temporary downloads are located in N-m3u8DL-RE folder
* Final file is moved to ~/Downloads

## Requirements

* _https://www.python.org/downloads/_
* https://www.videohelp.com/software/N-m3u8DL-RE
  - unpack it under a folder named N-m3u8DL-RE where the ZIP file was extracted
* https://www.bento4.com/downloads/
  - copy mp4decrypt to N-m3u8DL-RE folder
* https://ffmpeg.org/download.html
  - copy ffmpeg to N-m3u8DL-RE folder
* https://files.videohelp.com/u/303646/Auvio.zip
  - unpack it under a folder named Auvio where the ZIP file was extracted
    - patch l3.py, line 14 : `pssh = sys.argv[1]`
    - patch l3.py, line 15 : `lic_url = sys.argv[2]`
    - patch l3.py, line 34-35 :
      ```
      f = open(sys.argv[3], 'a')
      for key in keys:
        f.write('--key ' + key)
      f.close()
      ```

## Note

This is a mac Google Chrome only version (@todo : install procedure for Native Messaging Host and commands for other OS and browsers)

Avoid downloading multiple videos at the same time
