(function(){
  var debug = false;
  function t(str) {if (debug) console.log(str)}

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      t('request:');
      t(request);
      sendResponse({});
      if (!(request.method && request.method == 'download' && request.contacts)) {
	t('invalid request');
	return;
      }
      chrome.downloads.download(
	{
	  url: URL.createObjectURL(
	    new Blob(
	      request.contacts,
	      {endings: 'native', type: 'data/csv'})),
	  filename: 'Contacts.csv',
	  conflictAction: 'uniquify'},
	function (downloadId) {
	  t('downloadId: ' + downloadId);
	  chrome.downloads.onChanged.addListener(
	    function (downloadDelta) {
	      t('downloadDelta:');
	      t(downloadDelta);
	      if (downloadDelta.id == downloadId
		  && downloadDelta.state
		  && /complete|interrupt/i.test(downloadDelta.state.current))
		window.close();
	    });
	});
    });
})();
