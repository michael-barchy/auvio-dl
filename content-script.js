/* content-script.js */

chrome.runtime.sendMessage({ action: 'watch' });

new MutationObserver(function(mutations, observer) {
  setTimeout(function() {
    const toolbar = document.querySelector('div[class*=PlayerUI_rightContainer]');
    if (null !== toolbar && !toolbar.hasAttribute('with-auvio-dl')) {
      toolbar.setAttribute('with-auvio-dl', 'true');
      const button = toolbar.firstChild.cloneNode(true);
      button.classList.add('with-auvio-dl');
      toolbar.insertBefore(button, toolbar.firstChild);
      button.querySelector('button').addEventListener('click', function() {
        var title = document.title;
        var details = document.querySelector('[class*=TitleDetails_title_]');
        if (null !== details) {
          var details2 = document.querySelector('[class*=TitleDetails_subtitle_]');
          title = details.innerText.replace(/\s+/g, ' ').trim().replace(/ /g, '.');
          if (null !== details2) {
            var subtitle = details2.innerText.replace(/\s+/g, ' ').trim();
            if (subtitle.indexOf('Episode ') === 0) {
              subtitle = subtitle.replace('Episode ', 'E');
            } else {
              if (title.indexOf('Saison ') !== -1) {
                title = title.replace('Saison ', 'S');
              }
            }
            if (title.match(/S[0-9]+E[0-9]+/)) {
              title += '.' + subtitle.replace(/ /g, '.');
            } else if (subtitle.match(/S[0-9]+E[0-9]+/)) {
              title += '.' + subtitle.replace(/ /g, '.');
            } else if (title.match(/S[0-9]+/)) {
              title += subtitle;
            } else {
              title += '.S1' + subtitle.replace(/ /g, '.');
            }
          }
        }
        chrome.runtime.sendMessage({ action: 'download', name: title, url: window.location.href });
      });
    }
  }, 100);
}).observe(document, { childList: true, subtree: true });
