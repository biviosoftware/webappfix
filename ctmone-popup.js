(function(){
  var debug = true;
  function t(str) {if (debug) console.log(str)}

  var ddm = $('.dropdown-menu');
  ddm.remove('li.ctmone_contacts');

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {method: 'contacts'}, function(response) {
      t('response: ');
      t(response);
      if (!(response && response.contacts)) {
	t('invalid response');
	return;
      }
      t('contacts: ');
      t(response.contacts);
      var li = $('<li>', {role: 'presentation'});
      $('.dropdown-menu').append(li);
      // Due to a bug in Mac crown, can't just use href on this <a>
      // Have to create tab, force it to download, and close itself
      // See https://code.google.com/p/chromium/issues/detail?id=61632
      // Download shows up and disappears immediately
      li.append(
	$('<a>', {
	  role: 'menuitem',
	  tabindex: '-1',
	  text: 'Download Contacts',
	  click: function() {
	    chrome.tabs.create(
	      {url: 'ctmone-contacts-download.html'},
	      function (tab) {
		t('sendMessage: ');
		t(tab);
		chrome.tabs.sendMessage(
		  tab.id,
		  {method: 'download', contacts: response.contacts},
		  function () {});
	      });
	    window.close();
	  },
	}));
    });
  });
})();
