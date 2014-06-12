(function(){
  var property;
  var people = {};
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  function t(str) {
    console.log(str);
  }
  // To test this on local files call chrome with chrome --allow-file-access-from-files (see mac.sh)
  $('frame[name="re_left"]').contents().find('.black2').each(function (index) {
    var text = $(this).text().trim();
    if (index == 1) {
      property = text;
    }
    else if (/^(seller|buyer|listing agent|selling agent|title company|lender|inspection)$/i.test(text)) {
      traverse(toTitleCase(text), $(this).closest('tr').next());
    }
  });
  for (var who in people) {
    t(who);
    var fields = people[who];
    for (var field in fields) {
//      t(field + ': ' + fields[field]);
    }
  }
  function traverse(who, node) {
    node.contents().each(function (index) {
      var buyerOrSeller = /Seller|Buyer/.test(who);
      var lines = $(this).text().match(/[^\r\n]+/g);
      t('***' + who);
      if (lines.length < 5) {
	return;
      }
      var v = {};
      v['Company'] = buyerOrSeller ? '' : $(this).find('b u').text().trim();
      for (var i = 0; i < lines.length; i++) {
	var line = lines[i].trim();
	var field = line.match(/^(Phone|Work Ph|Fax|Cell Ph|Email):(.*)/i);
	if (field) {
	  var label = field[1];
//	  t(label);
	  label = label.replace(/ Ph/, '');
	  if (label == 'Phone') {
	    label = buyerOrSeller ? 'Home' : 'Work';
	  }
	  v[label] = field[2].trim();
//	  t(label + ' => ' + v[label]);
	}
      }
      people[who] = v;
    for (var f in people[who]) {
      t(f + '!! ' + v[f]);
    }
    });
  }
})();
