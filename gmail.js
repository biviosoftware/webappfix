(function(self){
  function replaceSelection() {
    var sel, range, old;
    sel = window.getSelection();
    if (!(sel.getRangeAt && sel.rangeCount)) {
      return;
    }
    range = sel.getRangeAt(0);
    old = sel.toString();
    range.deleteContents();
    range.insertNode(
      range.createContextualFragment(
	'<a href="https://www.google.com/search?q='
	    + encodeURIComponent(old)
	    + '">' + old + "</a>"));
  };
  function keyClick(evt) {
    if (!document.hasFocus()) {
      return true;
    }
    if (!evt.ctrlKey && !evt.shiftKey && !evt.metaKey && evt.altKey
	&& evt.keyCode == 76) {
      replaceSelection();
      evt.stopPropagation();
      evt.preventDefault();
      return false;
    }
    return true;
  };
  document.addEventListener('keydown', keyClick, false)
})(this);
