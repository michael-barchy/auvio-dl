#!/bin/sh

cd "$(dirname "$0")"
rm request.json >/dev/null 2>&1
rm download.sh >/dev/null 2>&1
if [ ! -f ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/auviodl.json ]
then
  cp -f auviodl.json ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/
  exit
fi
tee request.json
json=$(cat request.json)
json=${json:2}
echo $json >request.json
name=$(plutil -extract name raw request.json)
url=$(plutil -extract url raw request.json)
pssh=$(plutil -extract pssh raw request.json)
licenseUrl=$(plutil -extract licenseUrl raw request.json)
rm keys.*
echo python3 ./Auvio/l3.py \"$pssh\" \"$licenseUrl\" keys.txt >debug.log
echo cd \"$(dirname "$0")\" >>keys.sh
echo python3 ./Auvio/l3.py \"$pssh\" \"$licenseUrl\" keys.txt >>keys.sh
/bin/sh ./keys.sh
sleep 1
cat keys.txt >>debug.log
keys=$(cat keys.txt)
echo cd N_m3u8DL-RE \; ./N_m3u8DL-RE -M format=mkv --sub-format=VTT --auto-subtitle-fix --auto-select $keys \"$url\" --save-name \"$name\" \; mv \"$name.mkv\" ~/Downloads/ \; rm -f -R \"./$name/\" >download.sh
/bin/sh ./download.sh &
cat request.json