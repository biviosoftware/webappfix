(function(){
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log("rul " + $.url(tab.url).attr('host'));
    switch ($.url(tab.url).attr('host')) {
    case "":
    case "mail.google.com":
      chrome.pageAction.setPopup({
	tabId: tabId,
	popup: 'gmail-popup.html'
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
