// ==UserScript==
// @name Exportuj-Tabele_eDesk->Anki
// @namespace https://github.com/Ja-Tar/e-desk_table-to-anki
// @homepageURL  https://github.com/Ja-Tar/e-desk_table-to-anki
// @supportURL   https://github.com/Ja-Tar/e-desk_table-to-anki/issues
// @updateURL    https://github.com/Ja-Tar/e-desk_table-to-anki/raw/main/E-desk_table-to-anki.user.js
// @downloadURL  https://github.com/Ja-Tar/e-desk_table-to-anki/raw/main/E-desk_table-to-anki.user.js
// @match https://edesk.pearson.pl/*
// @grant none
// @version 0.1.2
// ==/UserScript==

setTimeout(() => {

const iframeDocument = document.getElementById('content-iframe').contentWindow.document;
// Find the div with class "header-container mdl-layout__header-row"
var headerDiv = document.querySelector(".right-side-menu-container");

// Create a button element
var runBtn = document.createElement('button');
runBtn.innerHTML = "Export Table";
runBtn.style.backgroundColor = "yellow";
runBtn.style.color = "black";
runBtn.style.padding = "10px";
runBtn.style.marginLeft = "10px";

// Append the button to the header div
headerDiv.appendChild(runBtn);

// Add a click event listener to the button
runBtn.addEventListener('click', function() {
  // Find the table-addon-wrapper div
  var addonWrapperDiv = iframeDocument.querySelector('.table-addon-wrapper');

  // Check if the div exists and contains a table
  if (addonWrapperDiv.querySelector('table')) {
    // Get all the rows from the table
    var rows = addonWrapperDiv.querySelectorAll('table tr');

    // Create an array to store the row data
    var rowData = [];

    // Loop through the rows and extract the data
    rows.forEach(function(row, index) {
      // Get all the cells in the row
      var cells = row.querySelectorAll('td, th');

      // Create an array to store the cell data
      var cellData = [];

      // Loop through the cells and extract the text
      cells.forEach(function(cell) {
        cellData.push(cell.innerText.trim());
      });

      // Add the cell data to the row data array
      rowData.push(cellData.join('\t'));
    });

    // Remove the first row from the row data array
    rowData.shift();

    // Convert the row data to a tab-separated string
    var tableData = rowData.join('\n');

    // Create a Blob object with the table data
    var blob = new Blob([tableData], {type: 'text/plain'});

    // Create a link element to download the text file
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tabela_do_anki.txt';

    // Click the link to download the file
    link.click();
  } else {
    console.log('No table found in .table-addon-wrapper div.');
  }
});
}, 6000);
