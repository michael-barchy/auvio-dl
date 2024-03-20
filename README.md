# auvio-dl

Download videos from auvio

## Installation

* Click Code -> Download ZIP
* Unpack to your favorite location
* Goto to Google Chrome extensions management
* Click "Load unpacked extension" and point to the folder where you extracted the ZIP file

## Requirements

* https://www.python.org/downloads/
* https://www.videohelp.com/software/N-m3u8DL-RE unpack it under a folder named N-m3u8DL-RE where the ZIP file was extracted
* https://www.bento4.com/downloads/ copy mp4decrypt to N-m3u8DL-RE folder
* https://ffmpeg.org/download.html copy ffmpeg to N-m3u8DL-RE folder
* https://files.videohelp.com/u/303646/Auvio.zip unpack it under a folder named Auvio where the ZIP file was extracted
  - patch l3.py, line 14 : pssh = sys.argv[1]
  - patch l3.py, line 15 : lic_url = sys.argv[2]
  - patch l3.py, line 34-35 :
    ```
    f = open(sys.argv[3], 'a')
    for key in keys:
      f.write('--key ' + key)
    f.close()
    ```

## Note

This is a mac Google Chrome only version (@todo : install procedure for Native Messaging Host and commands for other OS and browsers)
