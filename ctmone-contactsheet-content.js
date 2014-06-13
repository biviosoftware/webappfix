(function(){
  var people;
  var debug = true;
  function t(str) {if (debug) console.log(str)}

  addListener();

  function addListener() {
    t('adding listener');
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
	t(request);
	var response = {};
	if (request.method == 'contacts' && parse()) {
	  response = {contacts: formatRows()};
	}
	sendResponse(response);;
      });
  }

  function parse() {
    // To test this on local files call chrome --allow-file-access-from-files
    // (see mac.sh) for debugging
    var property;
    var top;

    if (!parseTop())
      return 0;
    people = {};
    t(top);
    top.contents().find('.black2').each(function (index) {
      var text = $(this).text().trim();
      if (index == 1) {
	property = text;
      }
      else if (!/^Property:/i.test(text)) {
	parseOne(toTitleCase(text), $(this).closest('tr').next());
      }
    });
    return Object.keys(people).length > 0;

    function parseTop() {
      top = $('frame[name="re_left"]');
      if (top.length <= 0) {
	t('Using body, not frame (for debugging)');
	top = $('body');
      }
      else {
	// Need to traverse into the frameset this way...
	top = top.contents().find('td.banner_blue').first().closest('body');
      }
      t(top);
      if (top.find('td.banner_blue strong:contains("CONTACT")').length == 0) {
	t('not contact sheet');
	return 0;
      }
      return 1;
    }

    function parseOne(who, node) {
      var buyerOrSeller = /Seller|Buyer/.test(who);
      var whoSuffix = buyerOrSeller ? '1' : '';
      var v = {};
      var company = parseCompany();
      var label = 'name';

      traverseTextNodes(node.get(0), []).forEach(parseTextNodes);

      function traverseTextNodes(node, nodes) {
	for (var i = 0; i < node.childNodes.length; i++) {
	  var c = node.childNodes[i];
	  if (c.nodeType === Node.TEXT_NODE) {
	    nodes.push(c.textContent.trim());
	  }
	  else {
	    traverseTextNodes(c, nodes);
	  }
	}
	return nodes;
      }

      function parseCompany() {
	var res = buyerOrSeller ? '' : node.find('b u').text().trim();
	if (/CALL TO INSPECT/i.test(res)) {
	  return '';
	}
	return res;
      }

      function parseTextNodes(line) {
	if (parseSkip() || parseField() || parseEmailHack() || parseName())
	  return;
	v[label] = line;
	t(label + ': ' + line);
	if (label === 'street') {
	  label = 'city';
	}
	return;

	function parseSkip() {
	  if (line.length <= 0 ||
	      /CALL TO INSPECT|click to edit/i.test(line) ||
	      line === company) {
	    t('skip: ' + line);
	    return 1;
	  }
	  return 0;
	}

	function parseField() {
	  var field = line.match(/^(Phone|Work Ph|Fax|Cell Ph|Email):$/i);
	  if (!field)
	    return 0;
	  label = field[1].replace(/ Ph/, '').toLowerCase();
	  t('label: ' + line);
	  v[label] = '';
	  return 1;
	}

	function parseEmailHack() {
	  if (!(buyerOrSeller && label == 'email'))
	    return 0;
	  label = 'name';
	  if (!/\@/.test(line))
	    return 0;
	  v['email'] = line;
	  t('email: ' + line);
	  return 1;
	}

	function parseName() {
	  if (label != 'name')
	    return 0;
	  var role = who + whoSuffix;
	  v = {
	    buyerOrSeller: buyerOrSeller,
	    role: role,
	    name: line,
	    company: company,
	    property: property,
	    street: '',
	    city: ''
	  };
	  t('*** role: ' + role);
	  t('name: ' + line);
	  people[role] = v;
	  if (buyerOrSeller) {
	    whoSuffix = parseInt(whoSuffix) + 1;
	  }
	  label = 'street';
	  return 1;
	}
      }
    }
  }

  function formatRows() {
    var header = [
      'Name', //0 - Name
      'Given Name', //1
      'Additional Name', //2
      'Family Name', //3
      'Yomi Name', //4
      'Given Name Yomi', //5
      'Additional Name Yomi', //6
      'Family Name Yomi', //7
      'Name Prefix', //8
      'Name Suffix', //9
      'Initials', //10
      'Nickname', //11
      'Short Name', //12
      'Maiden Name', //13
      'Birthday', //14
      'Gender', //15
      'Location', //16
      'Billing Information', //17
      'Directory Server', //18
      'Mileage', //19
      'Occupation', //20
      'Hobby', //21
      'Sensitivity', //22
      'Priority', //23
      'Subject', //24
      'Notes', //25 - Notes
      'Group Membership', //26
      'E-mail 1 - Type', //27 - Work or Home
      'E-mail 1 - Value', //28 - email
      'E-mail 2 - Type', //29
      'E-mail 2 - Value', //30
      'Phone 1 - Type', //31 - Work or Home
      'Phone 1 - Value', //32 - phone
      'Phone 2 - Type', //33 - mobile
      'Phone 2 - Value', //34 - Cell
      'Phone 3 - Type', //35 - Work Fax
      'Phone 3 - Value', //36 - fax
      'Address 1 - Type', //37 - Work or Home
      'Address 1 - Formatted', //38 - street\ncity
      'Address 1 - Street', //39
      'Address 1 - City', //40
      'Address 1 - PO Box', //41
      'Address 1 - Region', //42
      'Address 1 - Postal Code', //43
      'Address 1 - Country', //44
      'Address 1 - Extended Address', //45
      'Organization 1 - Type', //46 - Work
      'Organization 1 - Name', //47 - company
      'Organization 1 - Yomi Name', //48
      'Organization 1 - Title', //49
      'Organization 1 - Department', //50
      'Organization 1 - Symbol', //51
      'Organization 1 - Location', //52
      'Organization 1 - Job Description' //53
    ];
    var columnCount = header.length + 1;
    var rows = [formatCSV(header)];
    
    for (var who in people) {
      var fields = people[who];
      if (!fieldsOK(fields))
	continue;
      var row = Array(columnCount).join('x').split('x');
      var workOrHome = fields['buyerOrSeller'] ? 'Home' : 'Work';
      row[0] = fields['name'];
      row[25] = fields['role'] + ': ' + fields['property'];
      if (fields['email']) {
	row[27] = workOrHome;
	row[28] = fields['email'];
      }
      if (fields['phone']) {
	row[31] = workOrHome;
	row[32] = fields['phone'];
      }
      if (fields['cell']) {
	row[33] = 'Mobile';
	row[34] = fields['cell'];
      }
      if (fields['fax']) {
	row[35] = 'Work Fax';
	row[36] = fields['fax'];
      }
      if (fields['street'] && fields['city']) {
	row[37] = workOrHome;
	row[38] = fields['street'] + '\n' + fields['city'];
      }
      if (fields['company']) {
	row[46] = 'Work';
	row[47] = fields['company'];
      }
      t(formatCSV(row));
      rows.push(formatCSV(row));
    }
    return rows;

    function fieldsOK(fields) {
      return fields['name'].length && fields['email'].length;
    }
    function formatCSV(row) {
      return row.map(function (el) {
	return '"' + el.replace(/"/g, '""') + '"';
      }).join(',') + '\n';
    }
  }

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  function tPeople() {
    for (var who in people) {
      t(who);
      var fields = people[who];
      for (var field in fields) {
	t(field + ': ' + fields[field]);
      }
    }
    return;
  }
})();
