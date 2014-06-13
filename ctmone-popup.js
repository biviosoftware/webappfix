(function(){
  var debug = true;
  function t(str) {if (debug) console.log(str)}

  var ddm = $('.dropdown-menu');
  ddm.remove('li.ctmone_contacts');

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {method: 'contacts'}, function(response) {
      t('response');
      if (!response || !response.contacts) {
	t(response);
	return;
      }
      t('contacts: ' + response.contacts.length);
      var li = $('<li>', {role: 'presentation'});
      li.append(
	$('<a>', {
	  role: 'menuitem',
	  tabindex: '-1',
	  text: 'Download Contacts',
	  download: 'Contacts.csv',
	  href: URL.createObjectURL(
	    new Blob(response.contacts, {endings: 'native', type: 'data/csv'}))
	}));
      $('.dropdown-menu').append(li);
    });
  });

  function formatBlobURI(rows, type) {
    return 
  }
})();
