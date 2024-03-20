/* service-worker.js */

https://rbm-rtbf.live.ott.irdeto.com/licenseServer/widevine/v1/rbm-rtbf/license?contentId=3167998_6BA97Bb&keyId=8e1d711c-7eb5-46ed-b9c3-0e973fa2b978&ls_session=eyJ0eXAiOiJKV1QiLCJraWQiOiIwOGIzODQwZS0wYThhLTQyYTItODNhNC03ZGM0Mzc0ZDJmYmEiLCJhbGciOiJIUzI1NiJ9.eyJhaWQiOiJyYm0tcnRiZiIsInN1YiI6IjYzZjNjNGM0NmUxMzQ2M2FiMWI1ZDhhMzhjY2ZkNDA3XzZCQTk3QmIiLCJpYXQiOjE3MTA4NzA0NjcsImV4cCI6MTcxMDg3NDA2NywianRpIjoicE1abzlKd08wa2M4OFJyOFNjOU1vcWVMOUwxc1B3ZzVXS0lxUHVQbjVYVT0iLCJlbnQiOlt7ImVwaWQiOiJkZWZhdWx0IiwiYmlkIjoiZnJlZV9wcm9kdWN0XzZCQTk3QmIifV0sImlzZSI6dHJ1ZSwiZW5jcnlwdGlvblByb2ZpbGVJZCI6InJ0YmYifQ.WfoDtYUNWYckI9dPZBLP7Nk-hm1msCxgX4kxmEs_dCQ

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
