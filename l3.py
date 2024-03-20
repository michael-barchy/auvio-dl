# -*- coding: utf-8 -*-
# Module: KEYS-L3
# Created on: 11-10-2021
# Authors: -∞WKS∞-
# Version: 1.1.0

import base64, requests, sys, xmltodict
import headers
from pywidevine.L3.cdm import cdm, deviceconfig
from base64 import b64encode
from pywidevine.L3.getPSSH import get_pssh
from pywidevine.L3.decrypt.wvdecryptcustom import WvDecrypt

pssh = sys.argv[1]
lic_url = sys.argv[2]

def WV_Function(pssh, lic_url, cert_b64=None):
    wvdecrypt = WvDecrypt(init_data_b64=pssh, cert_data_b64=cert_b64, device=deviceconfig.device_android_generic)   
    print ('*** wvdecrypt ***')
    print (wvdecrypt)                
    widevine_license = requests.post(url=lic_url, data=wvdecrypt.get_challenge(), headers=headers.headers)
    print ('*** widevine_license ***')
    print (widevine_license)
    license_b64 = b64encode(widevine_license.content)
    print ('*** license_b64 ***')
    print(license_b64)
    wvdecrypt.update_license(license_b64)
    Correct, keyswvdecrypt = wvdecrypt.start_process()
    if Correct:
        return Correct, keyswvdecrypt   
correct, keys = WV_Function(pssh, lic_url)

print()
f = open(sys.argv[3], 'a')
for key in keys:
    f.write('--key ' + key)
f.close()
