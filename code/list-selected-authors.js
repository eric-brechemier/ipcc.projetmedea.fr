within("projetmedea.fr", function(publish, subscribe){

  var
    forEach = this.forEach,
    table = document.getElementById("data-table");

  function fillTable(data) {
    table.innerHTML = "";

    var
      header = document.createElement('thead'),
      rows = document.createElement('tbody'),
      row,
      cell;

    row = document.createElement('tr');
    forEach(data[0], function(header){
      var
        cell = document.createElement('th'),
        text = document.createTextNode(header);
      cell.appendChild(text);
      row.appendChild(cell);
    });
    header.appendChild(row);

    forEach(data, function(fields, position){
      if (position===0) {
        return; // skip heading row
      }
      row = document.createElement('tr');
      forEach(fields, function(field){
        var
          cell = document.createElement('td'),
          text = document.createTextNode(field);
        cell.appendChild(text);
        row.appendChild(cell);
      });
      rows.appendChild(row);
    });

    table.appendChild(header);
    table.appendChild(rows);
  }

  subscribe("filtered-data", fillTable);

});
