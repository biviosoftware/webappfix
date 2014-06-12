(function(){
  function t(str) {
    console.log(str);
  }
  function _host(url) {
    var host = url.attr('host');
    t(host);
    if (host != '') {
      if (host == 'www.ctmone.com') {
        if (/ContactSheet.asp/.test(url.attr('path'))) {
	  return 'ctmone-contactsheet';
	}
      }
      return host;
    }
    if (url.attr('protocol') != 'file') {
      return '';
    }
    var found = url.attr('path').match(new RegExp('test/([^/]+).html$'));
    if (!found) {
      return '';
    }
    t(found[1]);
    return found[1];
  }
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    switch (_host($.url(tab.url))) {
    case 'mail.google.com':
      chrome.pageAction.setPopup({
	tabId: tabId,
	popup: 'gmail-popup.html'
      });
      chrome.pageAction.show(tabId);
      break;
    case 'ctmone-contactsheet':
      chrome.pageAction.setPopup({
	tabId: tabId,
	popup: 'ctmone-popup.html'
      });
      chrome.pageAction.show(tabId);
      break;
    default:
      chrome.pageAction.setPopup({
	tabId: tabId,
	popup: ''
      });
      break;
    }
  });
})();
