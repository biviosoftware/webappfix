(function(){
  // http://stenevang.wordpress.com/2013/02/22/google-search-url-request-parameters/
  function actionOp(action) {
    switch (action) {
    case "I'm Feeling Lucky":
      return function(term) {
	return 'https://www.google.com/search?q='
	    + encodeURIComponent(term)
	    + '&btnI';
      };
    case 'Map':
      return function(term) {
	return 'https://www.google.com/maps/search/'
	    + encodeURIComponent(term)
      };
    case 'Places':
      return function(term) {
	return 'https://www.google.com/search?q='
	    + encodeURIComponent(term)
	    + '&tbm=plcs'
      };
    case 'Wikipedia':
      return function(term) {
	return 'http://en.wikipedia.org/wiki/'
	    + encodeURIComponent(term.replace(/ /g, '_'));
      };
    case 'YouTube':
      return function(term) {
	return 'https://www.youtube.com/results?search_query='
	    + encodeURIComponent(term);
      };
    default:
      alert('Bug1234: ' + action);
      return;
    }
  }

  function replaceSelection(sel, op) {
    var range = sel.getRangeAt(0);
    var old = sel.toString();
    range.deleteContents();
    var replace = op(old);
    if (replace != '') {
      range.insertNode(
	range.createContextualFragment(
	  '<a href="' + op(old.trim()) + '">' + old + '</a>'));
    }
  }

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // TODO: figure out why an alert before the response closes the sendReponse
    // port.  Error in content window "Attempting to use a disconnected port object"
    sendResponse({});
    var op = actionOp(request.action);
    if (op != null) {
	var sel = window.getSelection();
	if (sel && sel.getRangeAt && sel.rangeCount) {
	  replaceSelection(sel, op)
	}
	else {
	  alert('Please make a selection first');
	}
    }
    return false;
  });
})();
