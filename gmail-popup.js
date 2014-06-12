(function(){
  var li;
  ["I'm Feeling Lucky", 'Map', 'Places', 'Wikipedia'].forEach(function(action) {
    li = $('<li>', {
	role: 'presentation',
    });
    li.append(
      $('<a>', {
	role: 'menuitem',
	tabindex: '-1',
	text: action,
	href: '#',
	'click': function(event) {
	  chrome.tabs.query(
	    {active: true, currentWindow: true},
	    function(tabs) {
	      chrome.tabs.sendMessage(
		tabs[0].id,
		{action: $(event.target).text()},
		function(response) {
		  window.close();
		});
	      return;
	    }
	  );
	  return false;
	}
      })
    );
    $('.dropdown-menu').append(li);
  });
})();
