(function(self){
  var replaceSelection = function () {
    var sel = window.getSelection();
    if (!(sel.getRangeAt && sel.rangeCount)) {
      return;
    }
    var range = sel.getRangeAt(0);
    var old = sel.toString();
    range.deleteContents();
    range.insertNode(
      range.createContextualFragment(
	            '<a href="https://www.google.com/search?q='
	    + encodeURIComponent(old)
	    + '">' + old + "</a>"));
  };
  var keyClick = function(evt) {
    if (!document.hasFocus()) {
      return true;
    }
    if (!evt.ctrlKey && !evt.shiftKey && !evt.metaKey && evt.altKey && evt.keyCode == 76) {
      replaceSelection();
      evt.stopPropagation();
      evt.preventDefault();
      return false;
    }
    return true;
  };
  document.addEventListener('keydown', keyClick, false)
})(this);
