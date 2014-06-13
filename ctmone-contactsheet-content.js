(function(){
  var property;
  var people = {};
  function t(str) {console.log(str)}
  function traverse(node, nodes) {
    for (var i = 0; i < node.childNodes.length; i++) {
      var c = node.childNodes[i];
      if (c.nodeType === Node.TEXT_NODE) {
	nodes.push(c.textContent.trim());
      }
      else {
	traverse(c, nodes);
      }
    }
    return nodes;
  }
  function parseOne(who, node) {
    var buyerOrSeller = /Seller|Buyer/.test(who);
    var whoSuffix = buyerOrSeller ? '1' : '';
    var v = {};
    var company = buyerOrSeller ? '' : $(this).find('b u').text().trim();
    var label = 'Name';
    traverse(node.get(0), []).forEach(function (line) {
      if (line.length <= 0 ||
	  /CALL TO INSPECT|click to edit/i.test(line) ||
	  line === company) {
//	t('skip: ' + line);
	return;
      }
      var field = line.match(/^(Phone|Work Ph|Fax|Cell Ph|Email):$/i);
      if (field) {
	label = field[1].replace(/ Ph/, '');
	if (label == 'Phone') {
	  label = buyerOrSeller ? 'Home' : 'Work';
	}
//	t('label: ' + line);
	v[label] = '';
	return;
      }
      if (buyerOrSeller && label === 'Email') {
	label = 'Name';
	if (/\@/.test(line)) {
	  v['Email'] = line;
//	  t('Email: ' + line);
	  return;
	}
      }
      if (label === 'Name') {
	var role = who + whoSuffix;
	v = {
	  Role: role,
	  Name: line,
	  Company: company,
	  Street: '',
	  City: ''
	};
//	t('*** Role: ' + role);
//	t('Name: ' + line);
	people[role] = v;
	if (buyerOrSeller) {
	  whoSuffix = parseInt(whoSuffix) + 1;
	}
	label = 'Street';
	return;
      }
      v[label] = line;
//      t(label + ': ' + line);
      if (label === 'Street') {
	label = 'City';
      }
      return;
    });
  }
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  // To test this on local files call chrome --allow-file-access-from-files (see mac.sh)
  var top = $('frame[name="re_left"]');
  t('length ' + top.length);
  if (top.length <= 0) {
    t('body');
    top = $('body');
  }
  top.contents().find('.black2').each(function (index) {
    var text = $(this).text().trim();
    if (index == 1) {
      property = text;
    }
    else if (/^(seller|buyer|listing agent|selling agent|title company|lender|inspection)$/i.test(text)) {
      parseOne(toTitleCase(text), $(this).closest('tr').next());
    }
  });
  // for debugging
  if (typeof chrome.runtime.onMessage == 'undefined') {
    for (var who in people) {
      t(who);
      var fields = people[who];
      for (var field in fields) {
	t(field + ': ' + fields[field]);
      }
    }
    return;
  }
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.method == 'contacts') {
	sendResponse({contacts: people});
	return;
      }
      sendResponse({});
      return;
    });
})();
