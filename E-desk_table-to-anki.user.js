// ==UserScript==
// @name Exportuj-Tabele_eDesk->Anki
// @namespace https://github.com/Ja-Tar/e-desk_table-to-anki
// @homepageURL  https://github.com/Ja-Tar/e-desk_table-to-anki
// @supportURL   https://github.com/Ja-Tar/e-desk_table-to-anki/issues
// @updateURL    https://github.com/Ja-Tar/e-desk_table-to-anki/raw/main/E-desk_table-to-anki.user.js
// @downloadURL  https://github.com/Ja-Tar/e-desk_table-to-anki/raw/main/E-desk_table-to-anki.user.js
// @match https://edesk.pearson.pl/lesson/*
// @icon https://edesk.pearson.pl/favicon.ico
// @grant none
// @version 0.3.0
// ==/UserScript==

// ============================
// Funkcje
// ============================

function exportDataToFile(exportData, tabelkainfo, pagename="tabelka") {
  var blob = new Blob([exportData], { type: 'text/plain' });
  var link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = pagename + "_" + tabelkainfo + '.txt';
  link.click();
}

// ============================
// Main
// ============================

setTimeout(() => {
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
  try {
    headerDiv.appendChild(runBtn);
  } catch (error) {
    console.debug("Brak paska, czekam...")
  }

  // Add a click event listener to the button
  runBtn.addEventListener('click', function () {
    const iframeDocument = document.getElementById('content-iframe').contentWindow.document;

    // Find the table-addon-wrapper div
    var addonWrapperDiv;
    try {
      addonWrapperDiv = iframeDocument.querySelector(".Table_noHeader");
      // sprawdź czy tabela zawiera 2 kolumny
      if (addonWrapperDiv) {
        var rows = addonWrapperDiv.querySelectorAll('tr');
        var cells = rows[0].querySelectorAll('td, th');
        if (cells.length != 2) {
          console.log("Tabela nie zawiera 2 kolumn!");
          var tabelkainfo = "inne"
        } else {
          var tabelkainfo = "niemiecki"
        }
      } else {
        console.log("Tabela 'niemiecki' nie istnieje!");
        addonWrapperDiv = iframeDocument.querySelector('.table-addon-wrapper');
        var tabelkainfo = "angielski"
        if (!addonWrapperDiv) {
          console.log("Tabela 'angielski' nie istnieje!");
        }
      }
    } catch (error) {
      console.error("Błąd podczas wyszukiwania tabeli: " + error);
      return; // Przerwij działanie funkcji w przypadku błędu
    }

    if (tabelkainfo === "angielski") {

      // Get all the rows from the table
      var rows = addonWrapperDiv.querySelectorAll('table tr');

      // Create an array to store the row data
      var rowData = [];

      // Loop through the rows and extract the data
      rows.forEach(function (row, index) {
        // Get all the cells in the row
        var cells = row.querySelectorAll('td, th');

        // Create an array to store the cell data
        var cellData = [];

        // Loop through the cells and extract the text
        cells.forEach(function (cell) {
          // Remove any newlines and extra whitespace
          cleardata = cell.innerText.replace(/\n/g, " ").replace(/\s+/g, " ");
          cellData.push(cleardata.trim());
        });

        // Add the cell data to the row data array
        rowData.push(cellData.join('\t'));
      });

      // Remove the first row from the row data array
      var name = rowData.shift().replace(/\s+/g, "_");;

      // Convert the row data to a tab-separated string
      var tableData = rowData.join('\n');

      exportDataToFile(tableData, tabelkainfo, name);

    } else if (tabelkainfo === "niemiecki") {

      tabela = iframeDocument.querySelector(".Table_noHeader[style*='visibility: visible']");

      var exportData = "";

      // Pobierz wszystkie wiersze z tabeli
      var rows = tabela.querySelectorAll('tr');

      // Iteruj przez wiersze i wydobywaj dane
      rows.forEach(function (row) {
        // Pobierz wszystkie komórki w wierszu
        var cells = row.querySelectorAll('td');

        // Jeśli wiersz ma dwie komórki (niemieckie słowo i tłumaczenie)
        if (cells.length = 2) {
          // Pobierz niemieckie słowa i tłumaczenia jako listy
          var niemieckieSłowo = cells[0].innerText.trim().split('\n');
          var polskieTłumaczenie = cells[1].innerText.trim().split('\n');

          // Iteruj przez listy słów i dodaj każdą parę słowo-niemieckie tłumaczenie do danych eksportowych
          for (var i = 0; i < niemieckieSłowo.length; i++) {
            // Usuń białe znaki na początku i końcu każdego słowa
            var niemieckieSłowoTrimmed = niemieckieSłowo[i].trim();
            var polskieTłumaczenieTrimmed = polskieTłumaczenie[i].trim();

            // Dodaj niemieckie słowo, tab, polskie tłumaczenie i znak nowej linii do danych eksportowych
            exportData += niemieckieSłowoTrimmed + "\t" + polskieTłumaczenieTrimmed + "\n";
          }
        }
      });

      // Jeśli są dane do eksportu, utwórz plik tekstowy i pobierz go
      if (exportData) {
        exportDataToFile(exportData, tabelkainfo);
      }
    } else {

      tabela = iframeDocument.querySelector(".Table_noHeader[style*='visibility: visible']");

      var exportData = "";

      // Pobierz wszystkie wiersze z tabeli
      var rows = tabela.querySelectorAll('tr');

      // Iteruj przez wiersze i wydobywaj dane
      rows.forEach(function (row) {
        // Pobierz wszystkie komórki w wierszu
        var cells = row.querySelectorAll('td');

        // Jeśli wiersz ma co najmniej dwie komórki (niemieckie słowo i tłumaczenie)
        if (cells.length >= 2) {
          // Pobierz słowa w tabeli
          for (let i = 0; i < cells.length; i++) {
            // Pobierz tekst z komórki
            var cellText = cells[i].innerText;

            // Usuń znaki nowej linii i nadmiarowe spacje
            cellText = cellText.replace(/\n/g, " ").replace(/\s+/g, " ");

            // Dodaj tekst z komórki do danych eksportu
            exportData += cellText;

            // Jeśli to nie jest ostatnia komórka w wierszu, dodaj znak tabulacji
            if (i < cells.length - 1) {
              exportData += '\t';
            }
            else {
              exportData += '\n';
            }
          }
        }
      });

      // Jeśli są dane do eksportu, utwórz plik tekstowy i pobierz go
      if (exportData) {
        var pagename = iframeDocument.querySelector('.pagename').innerText;

        // Call the function
        exportDataToFile(exportData, tabelkainfo, pagename);
      }
    }
  });
}, 7000);
