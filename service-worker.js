/* service-worker.js */

var currentTabId = '';
var mpdUrlMask = 'https\:\/\/.*\.cdn\.redbee\.live\/rtbf\/auvio.*\.mpd';
var licenseUrlMask = 'https\:\/\/.*rtbf.*\/licenseServer\/.*';
var mdpRequestId = '';
var mdpUrl = '';
var licenseUrl = '';
var pssh = '';

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === 'watch') {
      currentTabId = sender.tab.id;
      chrome.debugger.attach({ tabId: sender.tab.id }, '1.0', function() {
        chrome.debugger.sendCommand({ tabId: currentTabId }, 'Network.enable');
        chrome.debugger.onEvent.addListener(function (debuggeeId, message, params) {
          if (message === 'Network.responseReceived') {
            if(params.response && params.response.url.match(mpdUrlMask)) {
              mdpRequestId = params.requestId;
              mdpUrl = params.response.url;
              pssh = '';
            }
            if(params.response && params.response.url.match(licenseUrlMask)) {
              licenseUrl = params.response.url;
            }
          }
          if (message === 'Network.loadingFinished') {
            if(params.requestId === mdpRequestId) {
              chrome.debugger.sendCommand({ tabId: currentTabId }, 'Network.getResponseBody', { requestId: params.requestId }, function(response) {
                var mpd = response.body.matchAll(/\<cenc\:pssh\>([^\<]+)\<\/cenc\:pssh\>/g);
                Array.from(mpd).forEach(function(result) {
                  if (pssh === '' || result[1].length < pssh.length) {
                    pssh = result[1];
                  }
                });
              });
            }
          }   
        });
      }); 
    } 
    if (request.action === 'download') {
      console.log(request.name, mdpUrl, pssh, licenseUrl);
      chrome.runtime.sendNativeMessage(
        'auviodl',
        {
          name: request.name,
          url: mdpUrl,
          pssh: pssh,
          licenseUrl: licenseUrl
        },
        function (response) {
          console.log('Received ' + response);
        }
      );      
    }
  }
);
