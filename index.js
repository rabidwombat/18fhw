  // your code goes here ...
var homeBuilder = {

  getForm: function() {
    return document.forms[0];
  },

  getAdd: function(e) {
    return homeBuilder.getForm().querySelector('.add');
  },

  getSubmit: function(e) {
    return document.getElementsByTagName('button')[1];
  },

  getAge: function(e) {
    return homeBuilder.getForm().elements.age.value;
  },

  getRelationship: function(e) {
    return homeBuilder.getForm().elements.rel.value;
  },

  isSmoker: function(e) {
    return homeBuilder.getForm().elements.smoker.checked;
  },

  getDebug: function() {
    return document.querySelectorAll('.debug')[0];
  },

  getJSON: function() {
    var result = [];
    var tbody = homeBuilder.getForm().querySelector('tbody');
    for (var i=0, ii=tbody.childNodes.length; i<ii; i++) {
      var newNode = {
        age:  tbody.childNodes[i].childNodes[0].innerHTML,
        rel:  tbody.childNodes[i].childNodes[1].innerHTML,
        smoker: tbody.childNodes[i].childNodes[2].innerHTML
      }
      result.push(newNode);
    }
    return result;
  },

  addListener: function(elem, action, handler) {
    if (elem.addEventListener) {
      elem.addEventListener(action, handler);
    } else {
      elem.attachEvent('on'+action, handler);
    }
  },

  clearDebug: function() {
    homeBuilder.getDebug().innerHTML = "";
  },

  trySubmit: function(e) {
    if (e.preventDefault) { e.preventDefault(); }
    if (e.stopPropagation) { e.stopPropagation(); }

    var tbody = homeBuilder.getForm().querySelector('tbody');
    if (tbody.childNodes.length == 0) {
      alert ('Must have some members of the household to submit');
      homeBuilder.clearDebug();
      return false;
    }

    homeBuilder.getDebug().innerHTML = JSON.stringify(homeBuilder.getJSON());
    homeBuilder.getDebug().style.display = 'block';
    return false;
  },

  tryAdd: function(e) {
    if (isNaN(homeBuilder.getAge()) || isNaN(parseInt(homeBuilder.getAge(), 10)) || parseInt(homeBuilder.getAge(), 10) < 1) { 
      alert ('Age must be a positive number');
      return false;
    }

    if (homeBuilder.getRelationship() == '') {
      alert ('A relationship must be set for every person added');
      return false;
    }
    homeBuilder.addRow();
    homeBuilder.clearPerson();
    homeBuilder.clearDebug();
  },

  removeRow: function(element) {
    // the element is the delete link.  Two parents up is the <tr>
    var row = element.parentNode.parentNode;
    row.parentNode.removeChild(row);
    homeBuilder.clearDebug();
  },

  clearPerson: function() {
    homeBuilder.getForm().elements.age.value = '';
    homeBuilder.getForm().elements.rel.value = '';
    homeBuilder.getForm().elements.smoker.checked = false;
  },

  createList: function() {
    var list = document.createElement('table');
    list.id = 'list';
    list.appendChild(document.createElement('thead'));
    list.childNodes[0].appendChild(document.createElement('tr'));
    var cellsToCreate = ['Age', 'Relationship', 'Smoker', 'Delete'];

    for (var i=0, ii=cellsToCreate.length; i<ii; i++) {
      var newCell = document.createElement('td');
      newCell.innerHTML = cellsToCreate[i];
      list.childNodes[0].childNodes[0].appendChild(newCell);
    }

    list.appendChild(document.createElement('tbody'));

    return list;
  },

  addRow: function() {
    var table = homeBuilder.getForm().querySelector('#list');
    var newRow = document.createElement('tr');

    var ageCell = document.createElement('td');
    ageCell.innerHTML = homeBuilder.getAge();
    newRow.appendChild(ageCell);

    var relationshipCell = document.createElement('td');
    relationshipCell.innerHTML = homeBuilder.getRelationship();
    newRow.appendChild(relationshipCell);

    var smokerCell = document.createElement('td');
    smokerCell.innerHTML = homeBuilder.isSmoker();
    newRow.appendChild(smokerCell);

    var deleteCell = document.createElement('td');
    deleteCell.innerHTML = '<td><a href="javascript:return false" onclick="homeBuilder.removeRow(this)">Delete</a></td>';
    newRow.appendChild(deleteCell);

    table.childNodes[1].appendChild(newRow);
  },

  buildCss: function() {
    var style = document.createElement('style');
    style.type = 'text/css';

    var css = 'button {' +
        'border-radius: 5px;' +
        'width: 120px;' +
        'margin: 10px;' +
      '}' +
      'input {' +
        'margin:10px 0;' +
      '}' +
      'td {' +
        'width: 140px;' +
      '}' +
      'label {' +
        'margin-right: 15px;' +
      '}';

    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    return style;
  }

}

window.onload = function() {
  document.querySelector('head').appendChild(homeBuilder.buildCss());
  homeBuilder.addListener(homeBuilder.getAdd(), 'click', homeBuilder.tryAdd);
  homeBuilder.addListener(homeBuilder.getForm(), 'submit', function(){return false});
  homeBuilder.addListener(homeBuilder.getSubmit(), 'click', homeBuilder.trySubmit);

  // IE <9 defaults all button types to 'submit'
  if (homeBuilder.getAdd().setAttribute) { homeBuilder.getAdd().setAttribute('type', 'button'); } 

  // Add the visual representation of the current list
  homeBuilder.getForm().appendChild(homeBuilder.createList());
}
