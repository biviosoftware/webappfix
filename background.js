(function(){
  function t(str) {console.log(str)}
  function _host(url) {
    var host = url.attr('host');
    if (host != 'localhost') {
      if (host != '') {
	return host;
      }
      if (url.attr('protocol') != 'file') {
	return '';
      }
    }
    var found = url.attr('path').match(new RegExp('test/([^/]+)(-\w+)?.html$'));
    if (!found) {
      return '';
    }
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
    case 'www.ctmecontracts.com':
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
