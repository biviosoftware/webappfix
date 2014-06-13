(function(){
  function t(str) {console.log(str)}
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {method: 'contacts'}, function(response) {
      if (!response || !response.contacts) {
	return;
      }
      var contacts = response.contacts;
      var ddm = $('.dropdown-menu');
      ddm.remove('li.waf_contact');
      for (var who in contacts) {
	var dl = $('<dl>');
	var li = $('<li>', {role: 'presentation', class: 'waf_contact'});
	li.append($('<h3>', {text: who}));
	var fields = contacts[who];
	for (var field in fields) {
	  dl.append($('<dt>', {text: field})),
	  dl.append($('<dd>', {text: fields[field]}));
	}
	li.append(dl);
	ddm.append(li);
      }
    });
  });
})();
